export interface DBDataSource<T> {
    tableName: string

    findOne: (id: string) => Promise<T[]>
    findAll: () => Promise<T[]>

    addOne: (school: T) => Promise<number>
    addMany: (schools: T[]) => Promise<number>

    deleteOne: (id: string) => Promise<number>
    deleteMany: (ids: string[]) => Promise<number>
}
