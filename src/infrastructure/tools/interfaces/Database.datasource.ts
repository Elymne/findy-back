export interface DatabaseDatasource<T> {
    tableName: string

    findOne: (id: string) => Promise<T[]>
    findAll: () => Promise<T[]>

    addOne: (value: T) => Promise<T>
    addMany: (values: T[]) => Promise<T[]>

    deleteOne: (id: string) => Promise<number>
    deleteMany: (ids: string[]) => Promise<number>
}
