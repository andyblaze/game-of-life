import { config } from "./config.js";
import GameEngine from "./game-engine.js";
import BingoBallDrawer from "./bingoball-drawer.js";
import BingoCaller from "./bingo-caller.js";


$(document).ready(function() {
    const engine = new GameEngine(config);
    const drawer = new BingoBallDrawer();
    const caller = new BingoCaller(drawer, engine, config.numberTexts);

    // Log state changes for debugging
    engine.on("state:change", ({ from, to }) => console.log(`STATE: ${from} → ${to}`));
    engine.on("event:ignored", ({ state, event }) => console.log(`IGNORED: ${event} in ${state}`));

    // Autodraw all numbers asynchronously
    async function drawNext() {
    return new Promise(resolve => {
        if (!this.drawer.getRemaining().length) {
            console.log("All numbers drawn!");
            this.engine.dispatch("END_GAME");
            resolve();
            return;
        }

        this.engine.dispatch("DRAW");

        const number = this.drawer.draw();
        const text = this.numberTexts[number] || number;
        console.log(`Number drawn: ${number} → "${text}"`);

        const delay = this.getHumanDelay(number);

        setTimeout(() => {
            this.engine.dispatch("DRAW_COMPLETE");
            resolve(); // <- only resolve when draw is fully done
        }, delay);
    });
}

async function autoDrawAll() {
    engine.dispatch("INIT"); // start the game

    while (drawer.getRemaining().length > 0) {
        await caller.drawNext(); // wait for each draw to finish
    }

    console.log("All numbers drawn!");
}
autoDrawAll()
});
