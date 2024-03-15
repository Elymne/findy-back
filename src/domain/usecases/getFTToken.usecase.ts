import { logger } from "@App/core/logger"
import { Token, TokenClient } from "@App/infrastructure/tools/clients/token.client"
import { Failure, Result, Success, UsecaseNoParams } from "@App/domain/usecases/abstract.usecase"
import { TokenFT } from "@App/infrastructure/datasources/ftapi/models/tokenFT"
import { TokenFTDatasource, TokenFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/tokkenFT.datasource"

export interface GetTokenFTUsecase extends UsecaseNoParams<Token> {
    tokenFTDatasource: TokenFTDatasource
}

export const GetTokenFTUsecaseImpl: GetTokenFTUsecase = {
    tokenFTDatasource: TokenFTDatasourceImpl,

    perform: async function (): Promise<Result<Token>> {
        try {
            const tokenManager = TokenClient.getInstance()

            if (tokenManager.shouldRenew()) {
                const tokenFT: TokenFT = await this.tokenFTDatasource.generate()
                tokenManager.setNewToken(tokenFT as Token)
            }

            return new Success({
                message: "A token has been founded !",
                data: tokenManager.token!,
            })
        } catch (error) {
            logger.error("[GetTokenFTUsecase]", error)
            return new Failure({
                message: "An error occured from server",
                errorCode: 500,
            })
        }
    },
}
