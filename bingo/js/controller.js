import BingoCard from "./bingocard.js";

export default class BingoController {
    constructor(engine, caller, renderer) {
        this.engine = engine;
        this.caller = caller;
        this.renderer = renderer;
        this.card = null;

        this.bindEvents();
    }

    bindEvents() {
        this.engine.on("state:enter:READY", () => {
            this.onReady();
        });

        this.engine.on("state:enter:DRAW_COMPLETE", () => {
            this.onDrawComplete();
        });
    }

    onReady() {
        console.log("Controller: READY → creating card");

        this.card = new BingoCard();
        this.renderer.renderCard(this.card);
    }

    onDrawComplete() {
        const number = this.caller.getLastNumber();

        console.log("Controller: DRAW_COMPLETE → marking", number);

        //this.card.mark(number);
        this.renderer.markCard(number);
    }
}

