import { randomFrom } from "./functions.js";

export default class SlotMachine {
    constructor(evaluator, config) {
        this.evaluator = evaluator;
        this.reels = Object.values(config.reels);
    }
    spinReel(reel) {
        return randomFrom(reel);
    }
    spin() {
        const result = this.reels.map(this.spinReel);
        return this.evaluator.evaluate(result);
    }
}