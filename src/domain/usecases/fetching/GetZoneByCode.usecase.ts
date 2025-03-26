import { Result, ResultType, Usecase } from "@App/core/Usecase"
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
                return new Result<Zone>(ResultType.FAILURE, 404, "[GetZoneByCode] This zone does not exists.", result, null)
            }

            return new Result(ResultType.SUCCESS, 200, "[GetZoneByCode] Zone found.", result, null)
        } catch (err) {
            return new Result<Zone>(ResultType.FAILURE, 500, "[GetZoneByCode] An exception has been throw. Check logs.", null, err)
        }
    }
}
