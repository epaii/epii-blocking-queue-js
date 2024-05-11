export type TaskItem = {
    fun: Function,
    resolve: Function,
    reject: Function
}
export function sleep(t: number) { return new Promise((r) => setTimeout(r, t)) };

export class BlockingQueue {
    queue: Array<TaskItem> = [];
    enable: boolean = true;
    stopimmediate: boolean = true;
    lockWaitNum: number = 0;
    lockFinishNum: number = 0;
    _clearAlllock:boolean = false;

    constructor(private interval: number = 50) {
        (async () => {
            while (true) {
                let item = this.queue.shift();
                if (!this.enable) {
                    if (this.stopimmediate || !item)
                        break;
                }

                if (item) {
                    try {
                        let out = await item.fun();
                        item.resolve(out);
                    } catch (error) {
                        item.reject(error);
                    }
                    await sleep(50);
                } else {
                    await sleep(interval);
                }

            }
        })();

    }

    push(fun: Function): Promise<any> {
        return new Promise((r, e) => {
            this.queue.push({
                fun,
                resolve: r,
                reject: e
            });
        });

    }
    unshift(fun: Function) {
        return new Promise((r, e) => {
            this.queue.unshift({
                fun,
                resolve: r,
                reject: e
            });
        });
    }
    size(): number {
        return this.queue.length;
    }
    stop(immediate: boolean = true) {
        this.enable = false;
        this.stopimmediate = immediate;
    }
    clear() {
        this.queue = [];
    }
    async lock() {
        this._clearAlllock = false;
        this.lockWaitNum++;
        let _forNum = this.lockWaitNum;
        await this.push(async () => {
            while (true) {
                if (_forNum - 1 === this.lockFinishNum) {
                    break;
                }
                if (this._clearAlllock) {
                    this.unlock();
                    throw new Error("thread is clear")
                }
                await sleep(100);
            }
        })
    }
    unlock() {
        this.lockFinishNum++;
    }
    clearAllWaitLock(){
        this._clearAlllock = true;
    }
}

let queues: Record<string, BlockingQueue> = {};

export function getBlockingQueue(name: string="main"): BlockingQueue {
    if (!queues[name]) {
        queues[name] = new BlockingQueue();
    }
    return queues[name];
}