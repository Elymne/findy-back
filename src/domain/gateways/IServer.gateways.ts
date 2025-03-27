export default interface IServer {
    createAndServe(): Promise<void>
}
