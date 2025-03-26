import { Failure, Result, Success } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import Zone from "@App/domain/models/Zone.model"
import ZoneRemoteRepository from "@App/domain/repositories/ZoneRemote.repository"

export interface GetZoneByCodeParams {
    code: string
}

export default class GetZoneByCode extends Usecase<Zone, GetZoneByCodeParams> {
    private zoneRepository: ZoneRemoteRepository

    public constructor(zoneRepository: ZoneRemoteRepository) {
        super()
        this.zoneRepository = zoneRepository
    }

    public async perform(params: GetZoneByCodeParams): Promise<Result<Zone>> {
        try {
            const result = await this.zoneRepository.findOne(params.code)
            if (result == null) {
                return new Failure(404, `[${this.constructor.name}] Trying to fetch the zone ${params.code} : it does not exists.`, {
                    message: `The code ${params.code} does not correspond to any zones`,
                })
            }
            return new Success(200, `[${this.constructor.name}] Trying to fetch the zone ${params.code} : success`, result)
        } catch (trace) {
            return new Failure(500, `[${this.constructor.name}] An exception has been thrown`, { message: "An internal error occured while fecthing zone." }, trace)
        }
    }
}
