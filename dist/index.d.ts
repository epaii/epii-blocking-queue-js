export type TaskItem = {
    fun: Function;
    resolve: Function;
    reject: Function;
};
export declare function sleep(t: number): Promise<unknown>;
export declare class BlockingQueue {
    private interval;
    queue: Array<TaskItem>;
    enable: boolean;
    stopimmediate: boolean;
    lockWaitNum: number;
    lockFinishNum: number;
    _clearAlllock: boolean;
    constructor(interval?: number);
    push(fun: Function): Promise<any>;
    unshift(fun: Function): Promise<unknown>;
    size(): number;
    stop(immediate?: boolean): void;
    clear(): void;
    lock(): Promise<void>;
    unlock(): void;
    clearAllWaitLock(): void;
}
export declare function getBlockingQueue(name?: string): BlockingQueue;
