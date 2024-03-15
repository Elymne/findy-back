export class TokenClient {
    private static instance: TokenClient
    private _token?: Token
    public _last?: number

    private constructor() {}

    public static getInstance(): TokenClient {
        if (!TokenClient.instance) TokenClient.instance = new TokenClient()
        return TokenClient.instance
    }

    public shouldRenew(): boolean {
        const currentTimestamp = Date.now()
        return !this._token || !this._last || currentTimestamp - this._last > this._token.expires_in
    }

    public setNewToken(newToken: Token): void {
        this._token = newToken
        this._last = Date.now()
    }

    public get token(): Token | undefined {
        return this._token
    }
}

export interface Token {
    scope: string
    expires_in: number
    token_type: string
    access_token: string
}
