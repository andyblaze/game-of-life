export default class AutoDraw {
    constructor(drawer, caller, engine) {
        this.drawer = drawer;
        this.caller = caller;
        this.engine = engine;
    }

    logStates() {
        // Log state changes for debugging
        this.engine.on("state:change", ({ from, to }) => console.log(`STATE: ${from} → ${to}`));
        this.engine.on("event:ignored", ({ state, event }) => console.log(`IGNORED: ${event} in ${state}`));
    }

    async autoDrawAll() {
        this.engine.dispatch("INIT"); // start the game

        while (this.drawer.getRemaining().length > 0) {
            // Use the caller's drawNext() to maintain human-style delays & text
            await this.caller.drawNext();
        }

        console.log("All numbers drawn!");
    }
}
