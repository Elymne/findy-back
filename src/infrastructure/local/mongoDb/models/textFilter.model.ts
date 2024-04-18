import TextFilter from "@App/domain/entities/textFilter.entity"
import { ObjectId } from "mongodb"

export default interface textFilterModel extends TextFilter, Document {
    _id: ObjectId
}
