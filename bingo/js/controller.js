import BingoCard from "./bingocard.js";
import BingoScorer from "./bingo-scorer.js";
import { config } from "./config.js";
import GridGenerator from "./grid-generator.js";

export default class BingoController {
    constructor(engine, caller, renderer) {
        this.engine = engine;
        this.caller = caller;
        this.renderer = renderer;
        this.cards = [];
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
        if ( this.cards.length === 0 ) {
            
            this.hasWon = false;
            //this.card = new BingoCard(config.gridSize, config.ranges, new GridGenerator(config.gridSize, config.ranges));
            this.cards = this.cardManager.generateMultipleCards(config.gridSize, config.ranges, 18);
            //console.log(this.card);
            this.renderer.renderCards(this.cards);
        }
    }
    onDrawComplete() {
        const number = this.caller.getLastNumber();
        const text = this.caller.getLastCall();
        this.renderer.displayCall(text);
        const winners = [];

        for ( const [idx, card] of this.cards.entries() ) {
            card.mark(number);
            this.renderer.markCards(number);

            const scores = this.scorer.calculate(card);
            if ( scores.length ) { //console.log(scores);
                winners.push({ index: idx, "card": card });
            }
        }
        if ( winners.length > 0 ) {
                this.renderer.markWinningLines(winners); // bug is here i think, marks 1 card only
                this.hasWon = true;
                console.log("🎉 BINGO!");
                console.log("Total score: ", this.scorer.totalScore());
                this.engine.dispatch("END_GAME");
                return;
            //}
        }
       this.engine.dispatch("CHECK_COMPLETE");
    }
}

