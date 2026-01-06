import { config } from "./config.js";
import GameEngine from "./game-engine.js";
import BingoBallDrawer from "./bingoball-drawer.js";
import BingoCaller from "./bingo-caller.js";
import BingoController from "./controller.js";
import Renderer from "./renderer.js";
import AutoDraw from "./auto-draw.js";
import BingoCardManager from "./card-manager.js";
import GridGenerator from "./grid-generator.js";

class BingoRound {
    constructor(config) {
        this.engine = new GameEngine(config);
        this.drawer = new BingoBallDrawer();
        this.caller = new BingoCaller(this.drawer, this.engine, config.numberTexts);
        this.renderer = new Renderer();
        this.controller = new BingoController(this.engine, this.caller, this.renderer);
        this.controller.setCardManager(new BingoCardManager(new GridGenerator()));
        this.autoDraw = new AutoDraw(this.drawer, this.caller, this.engine);
    }
    init() { 
        this.drawer.reset();   
        this.engine.dispatch("INIT");   
        this.autoDraw.autoDrawAll();
    }
}


$(document).ready(async function() { 
    const round = new BingoRound(config);
    $("#new-round").on("click", round.init.bind(round));
    round.init();
});
