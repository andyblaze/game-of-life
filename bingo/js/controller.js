import BingoCard from "./bingocard.js";
import BingoScorer from "./bingo-scorer.js";
import { config } from "./config.js";
import GridGenerator from "./grid-generator.js";

export default class BingoController {
    constructor(engine, caller, renderer) {
        this.engine = engine;
        this.caller = caller;
        this.renderer = renderer;
        this.card = null;
        this.hasWon = false;
        this.scorer = new BingoScorer(config.prizeMap); // default prizes
        this.bindEvents();
    }
    setCardManager(cm) {
        this.cardManager = cm;
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
            //console.log("Controller: READY → creating card");
            this.hasWon = false;
            this.card = new BingoCard(config.gridSize, config.ranges, new GridGenerator(config.gridSize, config.ranges));
            //this.card = this.cardManager.generateUniqueCard(config.gridSize, config.ranges)
            this.renderer.renderCard(this.card);
        }
    }
    onDrawComplete() {
        const number = this.caller.getLastNumber();
        const text = this.caller.getLastCall();
        this.renderer.displayCall(text);

        //console.log("Controller: CHECKING → marking", number);

        this.card.mark(number);
        this.renderer.markCard(number);
        this.renderer.markWinningLines(this.card);
        //console.log(this.caller.getDrawn().length, this.caller.getRemaining().length);

        const scores = this.scorer.calculate(this.card);
        if (scores.length && !this.hasWon) {
            this.hasWon = true;
            console.log("🎉 BINGO!");
            console.log("Total score: ", this.scorer.totalScore());
            this.engine.dispatch("END_GAME");
            return;
        }
       this.engine.dispatch("CHECK_COMPLETE");
    }
}

