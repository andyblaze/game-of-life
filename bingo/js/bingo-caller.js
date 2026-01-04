import { mt_rand, randomFrom } from "./functions.js";

export default class BingoCaller {
    constructor(drawer, engine, numberTexts) {
        this.drawer = drawer; // instance of BingoBallDrawer
        this.engine = engine; // your GameEngine
        this.numberTexts = numberTexts; 
        this.lastNumber = 0;
        this.lastCall = "";
    }
    getDrawn() {
        return this.drawer.getDrawn();
    }
    getRemaining() {
        return this.drawer.getRemaining();
    }
    getLastNumber() {
        return this.lastNumber;
    }
    getLastCall() {
        return this.lastCall;
    }
    async drawNext() {
        if ( !this.drawer.getRemaining().length ) {
            this.engine.dispatch("END_GAME");
            return;
        }
        this.engine.dispatch("DRAW");

        // Pick a number
        const number = this.drawer.draw();
        this.lastNumber = number; 

        // Show the “called” text
        const texts = this.numberTexts[number];
        const text = randomFrom(texts);
        this.lastCall = `${text} ${number}`;
        //console.log(`Number drawn: ${number} → "${text}"`);

        // Wait a human-like interval
        const delay = mt_rand(1000, 2500);  // ms
        await this.sleep(delay);

        // Signal draw complete
        this.engine.dispatch("DRAW_COMPLETE");
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
