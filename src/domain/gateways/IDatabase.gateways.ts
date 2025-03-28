/**
 * Simple interface that dictate that whatever database type we use, we should start a connexion.
 * This should be implemented by any class that is used to create and make database request.
 */
export default interface IDatabase {
    /**
     * Start the connexion with the local datasource.
     */
    startConnec(): Promise<void>

    /**
     * Check the current config and create if not created yet all the tables + data needed to the connected local datasource.
     */
    check(): Promise<void>

    /**
     * For dev purpose, allow us to reset tables and config to the current database.
     */
    reset(): Promise<void>
}
