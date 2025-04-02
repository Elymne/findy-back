import { Failure, Result, Success } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"
import ZoneLocalRepository from "@App/domain/repositories/ZoneLocal.repository"
import ZoneRemoteRepository from "@App/domain/repositories/ZoneRemote.repository"

export default class UpdateZone extends UsecaseNoParams<void> {
    private zoneLocalRepository: ZoneLocalRepository
    private zoneRemoteRepository: ZoneRemoteRepository

    constructor(zoneLocalRepository: ZoneLocalRepository, zoneRemoteRepository: ZoneRemoteRepository) {
        super()
        this.zoneLocalRepository = zoneLocalRepository
        this.zoneRemoteRepository = zoneRemoteRepository
    }

    public async perform(): Promise<Result<void>> {
        try {
            const newZones = await this.zoneRemoteRepository.findAll()
            if (newZones.length == 0) {
                return new Failure(
                    500,
                    `[${this.constructor.name}] Trying to make an update of zones : No zones found from remote datasource (odd behavior). zones from local datasource rest intact.`,
                    {
                        message: "An error occured while making the update of zones because data were not found on remote datasource. Old zones stay instact.",
                    }
                )
            }

            await this.zoneLocalRepository.deleteAll()
            await this.zoneLocalRepository.createAll(newZones)

            return new Success(204, `[${this.constructor.name}] Trying to make an update of zones : success`, undefined)
        } catch (trace) {
            return new Failure(
                500,
                `[${this.constructor.name}] Trying to make an update of zones : An exception has been thrown.`,
                { message: "An internal error occured while making an update of zones" },
                trace
            )
        }
    }
}
