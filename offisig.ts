import { ethers } from 'ethers'
import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
dotenvConfig({ path: resolve(__dirname, './.env') })

const input = [{ "scheme": "exact", "network": "base-sepolia", "maxAmountRequired": "1000", "resource": "http://localhost:4088/api/weather", "description": "SETTLE Mint / Early Access $SETTLE 7000000.0", "mimeType": "", "payTo": "0x20c84933F3fFAcFF1C0b4D713b059377a9EF5fD1", "maxTimeoutSeconds": 60, "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e", "extra": { "name": "USD Coin", "version": "2" } }]
const pk = process.env.PAYER_PK
if (!pk) {
    throw new Error('not set PAYER_PK    ')
}
const wallet = new ethers.Wallet(pk)

// 组装 EIP-712 数据并签名
async function signExactPayload() {
    const req = input[0]
    const chainId = req.network === 'base-sepolia' ? 84532 : 8453
    const decimals = 6 // USDC
    const valueAtomic =
        req.maxAmountRequired.includes('.')
            ? ethers.parseUnits(req.maxAmountRequired, decimals)
            : BigInt(req.maxAmountRequired)


    const now = Math.floor(Date.now() / 1000)
    const validAfter = BigInt(now)
    const validBefore = BigInt(Math.floor(Date.now() / 1000) + Math.min(Number(req.maxTimeoutSeconds ?? 60), 60) - 2)
    const nonce = ethers.hexlify(ethers.randomBytes(32)) // bytes32

    const domain = {
        name: req.extra?.name ?? 'USD Coin',
        version: req.extra?.version ?? '2',
        chainId,
        verifyingContract: req.asset
    }

    const types = {
        TransferWithAuthorization: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'validAfter', type: 'uint256' },
            { name: 'validBefore', type: 'uint256' },
            { name: 'nonce', type: 'bytes32' }
        ]
    }

    const message = {
        from: wallet.address,
        to: req.payTo,
        value: valueAtomic,
        validAfter,
        validBefore,
        nonce
    }

    const signature = await wallet.signTypedData(domain, types as any, message)

    // x402 payload（供 X-PAYMENT 使用）
    const payload = {
        signature,
        authorization: {
            from: message.from,
            to: message.to,
            value: message.value.toString(),       // 原子单位（USDC 6位）
            validAfter: message.validAfter.toString(),
            validBefore: message.validBefore.toString(),
            nonce: message.nonce
        }
    }

    // 如需完整 header（可按需提交）
    const x402paymentHeader = {
        x402Version: 1,
        scheme: 'exact',
        network: req.network,
        payload
    }

    const x402HeaderBase64 = Buffer.from(JSON.stringify(x402paymentHeader), 'utf8').toString('base64')
    console.log(x402HeaderBase64)
    // 如需输出完整 header：console.log(JSON.stringify(x402paymentHeader, null, 2))
}

signExactPayload().catch(err => {
    console.error('签名失败:', err)
    process.exit(1)
})