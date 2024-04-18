import JobOfferHistory from "@App/domain/entities/jobOfferHistory"
import { ObjectId } from "mongodb"

export default interface JobOfferHistoryModel extends JobOfferHistory, Document {
    _id: ObjectId
}
