import { randomFrom } from "./functions.js";

function findSymbolIndices(reel, symbol) {
    const indices = [];
    reel.forEach((s, i) => {
        if (s === symbol) indices.push(i);
    });
    return indices;
}

function randomStop(reel, symbol) {
    const possibleStops = findSymbolIndices(reel, symbol);
    return randomFrom(possibleStops);
}
export default class SlotMachine {
    constructor(config) {
        this.reels = Object.values(config.reels);
        //console.log(this.reels);
    }
    spinReel(reel) {
        return randomFrom(reel);
    }
    spin() {
        const symbols = this.reels.map(this.spinReel); console.log(symbols);
        let result = [];
        for ( const [idx, s] of symbols.entries() )
            result.push(randomStop(this.reels[idx], s));
        return { indices: result, "symbols": symbols };
    }
}