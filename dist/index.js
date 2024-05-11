"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockingQueue = exports.sleep = void 0;
function sleep(t) { return new Promise((r) => setTimeout(r, t)); }
exports.sleep = sleep;
;
class BlockingQueue {
    constructor(interval = 50) {
        this.interval = interval;
        this.queue = [];
        this.enable = true;
        this.stopimmediate = true;
        this.lockWaitNum = 0;
        this.lockFinishNum = 0;
        (() => __awaiter(this, void 0, void 0, function* () {
            while (true) {
                let item = this.queue.shift();
                if (!this.enable) {
                    if (this.stopimmediate || !item)
                        break;
                }
                if (item) {
                    try {
                        let out = yield item.fun();
                        item.resolve(out);
                    }
                    catch (error) {
                        item.reject(error);
                    }
                    yield sleep(50);
                }
                else {
                    yield sleep(interval);
                }
            }
        }))();
    }
    push(fun) {
        return new Promise((r, e) => {
            this.queue.push({
                fun,
                resolve: r,
                reject: e
            });
        });
    }
    unshift(fun) {
        return new Promise((r, e) => {
            this.queue.unshift({
                fun,
                resolve: r,
                reject: e
            });
        });
    }
    size() {
        return this.queue.length;
    }
    stop(immediate = true) {
        this.enable = false;
        this.stopimmediate = immediate;
    }
    clear() {
        this.queue = [];
    }
    lock() {
        return __awaiter(this, void 0, void 0, function* () {
            this.lockWaitNum++;
            let _forNum = this.lockWaitNum;
            yield this.push(() => __awaiter(this, void 0, void 0, function* () {
                while (true) {
                    if (_forNum === this.lockFinishNum) {
                        break;
                    }
                    if (!this.enable) {
                        break;
                    }
                    yield sleep(100);
                }
            }));
        });
    }
    unlock() {
        this.lockFinishNum++;
    }
}
exports.BlockingQueue = BlockingQueue;
