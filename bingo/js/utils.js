import { mt_rand } from "./functions.js";

export class RandomItem {
    constructor(arrLength) {
        this.reset(arrLength);
    }
    reset(arrLength) {
        this.recent = [];
        this.maxQueueLength = this.setQueueLength(arrLength);
    }
    setQueueLength(arrLen) {
        if ( arrLen < 2 ) return 0;
        if ( arrLen < 5 ) return 1;
        if ( arrLen < 11 ) return 2;
        return Math.floor(arrLen / 5); // 20 %
    }
    getFrom(arr) {
        //console.log(this.recent.length, this.maxQueueLength, arr.length);
        let arrIdx = mt_rand(0, arr.length - 1);
        while ( this.recent.indexOf(arrIdx) !== -1 )
            arrIdx = mt_rand(0, arr.length - 1);
        this.recent.push(arrIdx);
        if ( this.recent.length > this.maxQueueLength )
            this.recent.shift();
        return arr[arrIdx];
    }
}