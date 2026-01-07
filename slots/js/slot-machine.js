import { randomFrom } from "./functions.js";

export default class SlotMachine {
    constructor(config) {
        this.reels = Object.values(config.reels);
    }
    spinReel(reel) {
        return randomFrom(reel);
    }
    spin() {
        return this.reels.map(this.spinReel);
    }
}