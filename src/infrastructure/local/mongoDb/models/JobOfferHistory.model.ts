import JobOfferHistory from "@App/domain/entities/jobOfferHistory"
import { ObjectId } from "mongodb"

interface JobOfferHistoryModel extends JobOfferHistory, Document {
    _id: ObjectId
}
