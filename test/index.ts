import { BlockingQueue } from "../src";

function sleep(t: number) { return new Promise((r) => setTimeout(r, t)) };

const bq = new BlockingQueue();

for (let index = 0; index < 10; index++) {

     
    bq[index<5?"push":"unshift"](async function () {
        await sleep(3000);
        return { a: index };
    }).then(res => {
        console.log(res);

    });
    console.log("push:"+index);
    
}

setTimeout(() => {
    bq.stop(false);
}, 10000);

