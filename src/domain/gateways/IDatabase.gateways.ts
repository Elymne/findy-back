/**
 * Simple interface that dictate that whatever database type we use, we should start a connexion.
 * This should be implemented by any class that is used to create and make database request.
 */
export default interface IDatabase {
    startConnec(): Promise<void>
}
