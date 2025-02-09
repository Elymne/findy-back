import School from "@App/domain/models/School.model";
import SchoolRepository from "@App/domain/repositories/School.repository";

export const SchoolDatasource: SchoolRepository = {
    findAll: function (): School[] {
        throw new Error("Function not implemented.");
    },
};
