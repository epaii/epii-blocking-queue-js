import { BlockingQueue, getBlockingQueue } from "../src";

function sleep(t: number) { return new Promise((r) => setTimeout(r, t)) };

//const bq = new BlockingQueue();

// for (let index = 0; index < 10; index++) {


//     bq[index<5?"push":"unshift"](async function () {
//         await sleep(3000);
//         return { a: index };
//     }).then(res => {
//         console.log(res);

//     });
//     console.log("push:"+index);

// }


let bq = getBlockingQueue("main");
for (let index = 0; index < 10; index++) {

    setTimeout(async () => {
        try {
            await bq.lock();
            console.log(index);
            await sleep(2000);
            bq.unlock();
        } catch (error) {
            console.log(error)
        }


    }, index * 1000);


    console.log("push:" + index);

}

setTimeout(() => {
    bq.stop(false);
}, 10000);

