import { config } from "./config.js";
import GameEngine from "./game-engine.js";
import BingoBallDrawer from "./bingoball-drawer.js";
import BingoCaller from "./bingo-caller.js";
import BingoController from "./controller.js";
import Renderer from "./renderer.js";
import AutoDraw from "./auto-draw.js";


$(document).ready(function() {
    const engine = new GameEngine(config);
    const drawer = new BingoBallDrawer();
    const caller = new BingoCaller(drawer, engine, config.numberTexts);
    const renderer = new Renderer();
    const controller = new BingoController(engine, caller, renderer);
    engine.dispatch("INIT"); // IDLE → READY
    caller.drawNext();
    //const autoDraw = new AutoDraw(drawer, caller, engine);
    //autoDraw.autoDrawAll();
});
