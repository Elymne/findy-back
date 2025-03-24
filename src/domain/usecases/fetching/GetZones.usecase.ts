import { Result, ResultType, Usecase } from "@App/core/Usecase";
import Zone from "@App/domain/models/Zone.model";
import ZoneRepository from "@App/domain/repositories/Zone.repository";

export interface GetZonesParams {
    text: string;
}

export default class GetZones extends Usecase<Zone[], GetZonesParams> {
    private zoneRepository: ZoneRepository;

    public constructor(zoneRepository: ZoneRepository) {
        super();
        this.zoneRepository = zoneRepository;
    }

    public async perform(params: GetZonesParams): Promise<Result<Zone[]>> {
        try {
            const result = await this.zoneRepository.findAll(params.text);

            if (result.length == 0) {
                return new Result(ResultType.SUCCESS, 204, "[GetZones] No zones found. It may be a problem.", [], null);
            }

            return new Result(ResultType.SUCCESS, 200, "[GetZones] Zones found.", result, null);
        } catch (err) {
            return new Result<Zone[]>(ResultType.FAILURE, 500, "[GetZones] An exception has been throw. Check logs.", null, err);
        }
    }
}
