export interface UnitOfWork {
    do<Output>(action: () => Promise<Output>): Promise<Output>;
}
