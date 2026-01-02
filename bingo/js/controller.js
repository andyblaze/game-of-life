import BingoCard from "./bingocard.js";

export default class BingoController {
    constructor(engine, caller, renderer) {
        this.engine = engine;
        this.caller = caller;
        this.renderer = renderer;
        this.card = null;
        this.hasWon = false;

        this.bindEvents();
    }

    bindEvents() {
        this.engine.on("state:enter:READY", () => {
            this.onReady();
        });

        this.engine.on("state:enter:CHECKING", () => {
            this.onDrawComplete();
        });
    }

    onReady() {
        console.log("Controller: READY → creating card");
        this.hasWon = false;
        this.card = new BingoCard();
        this.renderer.renderCard(this.card);
    }

    onDrawComplete() {
        const number = this.caller.getLastNumber();

        console.log("Controller: CHECKING → marking", number);

        this.card.mark(number);
        this.renderer.markCard(number);
    }
}

