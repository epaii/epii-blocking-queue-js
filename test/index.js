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
const src_1 = require("../src");
function sleep(t) { return new Promise((r) => setTimeout(r, t)); }
;
const bq = new src_1.BlockingQueue();
for (let index = 0; index < 10; index++) {
    bq[index < 5 ? "push" : "unshift"](function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield sleep(3000);
            return { a: index };
        });
    }).then(res => {
        console.log(res);
    });
    console.log("push:" + index);
}
setTimeout(() => {
    bq.stop(false);
}, 10000);
