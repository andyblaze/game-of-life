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
        const winningCorners = this.card.getWinningCorners();
        if ( winningCorners.length > 0 )
            this.renderer.markWinningCorners(this.card);
        const winningCol = this.card.getWinningColumn();
        if ( winningCol.length > 0 ) {
            this.renderer.markWinningColumn(this.card);
        }
        const winningRow = this.card.getWinningRow();
        if ( winningRow.length > 0 ) {
            this.renderer.markWinningRow(this.card);
        }
        const winningDiagonal = this.card.getWinningDiagonals();
        if ( winningDiagonal.length > 0 ) {
            this.renderer.markWinningDiagonal(this.card);
        }

        const scores = this.scorer.calculate(this.card);
        if (scores.length && !this.hasWon) {
            this.hasWon = true;
            console.log("🎉 BINGO! Patterns: ", scores);
            console.log("Total score: ", this.scorer.totalScore(this.card));
            this.engine.dispatch("END_GAME");
            return;
        }
       this.engine.dispatch("CHECK_COMPLETE");
    }
}

