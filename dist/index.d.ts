export type TaskItem = {
    fun: Function;
    resolve: Function;
    reject: Function;
};
export declare function sleep(t: number): Promise<unknown>;
export declare class BlockingQueue {
    queue: Array<TaskItem>;
    enable: boolean;
    stopimmediate: boolean;
    constructor(interval?: number);
    push(fun: Function): Promise<any>;
    unshift(fun: Function): Promise<unknown>;
    size(): number;
    stop(immediate?: boolean): void;
    clear(): void;
}
