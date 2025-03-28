import { Failure, Result, Success } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import Zone from "@App/domain/models/Zone.model"
import ZoneLocalRepository from "@App/domain/repositories/ZoneLocal.repository"

export interface GetZoneByCodeParams {
    id: string
}

export default class GetZoneByID extends Usecase<Zone, GetZoneByCodeParams> {
    private zoneLocalRepository: ZoneLocalRepository

    public constructor(zoneLocalRepository: ZoneLocalRepository) {
        super()
        this.zoneLocalRepository = zoneLocalRepository
    }

    public async perform(params: GetZoneByCodeParams): Promise<Result<Zone>> {
        try {
            const result = await this.zoneLocalRepository.findOne(params.id)
            if (result == null) {
                return new Failure(404, `[${this.constructor.name}] Trying to fetch the zone ${params.id} : it does not exists.`, {
                    message: `The code ${params.id} does not correspond to any zones`,
                })
            }
            return new Success(200, `[${this.constructor.name}] Trying to fetch the zone ${params.id} : success`, result)
        } catch (trace) {
            return new Failure(500, `[${this.constructor.name}] An exception has been thrown`, { message: "An internal error occured while fecthing zone." }, trace)
        }
    }
}
