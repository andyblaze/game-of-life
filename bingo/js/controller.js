import BingoCard from "./bingocard.js";
import BingoScorer from "./bingo-scorer.js";

export default class BingoController {
    constructor(engine, caller, renderer) {
        this.engine = engine;
        this.caller = caller;
        this.renderer = renderer;
        this.card = null;
        this.hasWon = false;
        this.scorer = new BingoScorer(); // default prizes

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
        if ( this.card === null ) {
            console.log("Controller: READY → creating card");
            this.hasWon = false;
            this.card = new BingoCard();
            this.renderer.renderCard(this.card);
        }
    }

    onDrawComplete() {
        const number = this.caller.getLastNumber();

        console.log("Controller: CHECKING → marking", number);

        this.card.mark(number);
        this.renderer.markCard(number);
        this.renderer.markWinningLines(this.card);

        const scores = this.scorer.calculate(this.card);
        if (scores.length && !this.hasWon) {
            this.hasWon = true;
            console.log("🎉 BINGO! Patterns: ", scores);
            console.log("Total score: ", this.scorer.totalScore());
            this.engine.dispatch("END_GAME");
            return;
        }
       this.engine.dispatch("CHECK_COMPLETE");
    }
}

