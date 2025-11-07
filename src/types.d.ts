export type IMasterSetup = {
	settle_admin: string
	settle_u1: string
	base_endpoint: string
	base: {
		CDP_API_KEY_ID: string
		CDP_API_KEY_SECRET: string
	}
	settle_contractAdmin: string[]
	event_endpoint: string
}

/**
 *      address from,
		uint256 usdcAmount,
		uint256 validAfter,
		uint256 validBefore,
		bytes32 nonce,
		uint8 v,
		bytes32 r,
		bytes32 s
 */

export type IEIP3009depositWithUSDCAuthorization = {
	address: string
	usdcAmount: string
	validAfter: number
	validBefore: number
	nonce: string
	v: number
	r: string
	s: string
}

export type airDrop = {
	wallet: string
	settle: string
}


export type ReflashData = {
	hash: string
	wallet: string
	SETTLE: string
	USDC: string
	timestmp: string
}

type ISettleEvent = {
	from: string
	amount: string
	SETTLTAmount: string
	txHash: string
}

// ============================================
// EIP-712 typedData
// ============================================
export type EIP712 = {
	types: string
	primaryType: string
	domain: {
		chainId: number
		name: string
		verifyingContract: string
		version: string
	}
	message: {
		from: string
		to: string
		value: string
		validAfter: number
		validBefore: number
		nonce: string
	}
}

export type x402SettleResponse = {
	network: string
	payer: string
	success: boolean
	transaction: string
}

export type x402Response = {
	timestamp: string
	network: string
	payer: string
	success: boolean
	USDC_tx?: string
	SETTLE_tx?: string
}

export type payload = {

	signature: string
	authorization: {
		from: string
		to: string
		value: string
		validAfter: string
		validBefore: string
		nonce: string
	}


}

export type x402paymentHeader = {
	x402Version: number
	scheme: 'exact',
	network: string
	payload: payload
}


export type facilitatorsPoolType = {
	from: string
	value: string
	validAfter: string
	validBefore: string
	nonce: string
	signature: string
	res: any
}


export type body402 = {
	EIP712: EIP712
	sig: string
}

export type SignatureComponents = {
	v: number
	r: string
	s: string
	recoveredAddress: string
	isValid: boolean
}