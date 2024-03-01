export interface DBDataSource<T> {
    tableName: string

    findOne: (id: string) => Promise<T[]>
    findAll: () => Promise<T[]>

    addOne: (school: T) => Promise<number>
    addMany: (schools: T[]) => Promise<number>

    deleteOne: (id: string) => Promise<number>
    deleteMany: (ids: string[]) => Promise<number>
}

// https://www.welcometothejungle.com/fr/jobs?refinementList%5Boffices.country_code%5D%5B%5D=FR&refinementList%5Bcontract_type%5D%5B%5D=apprenticeship&query=&page=1
