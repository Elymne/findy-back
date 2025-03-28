import { Result } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"

/**
 * It's maybe useless.
 */
export default class CheckDatabaseConfig extends UsecaseNoParams<void> {
    public perform(): Promise<Result<void>> {
        throw new Error("Method not implemented.")
    }
}
