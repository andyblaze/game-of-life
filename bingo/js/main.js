import { config } from "./config.js";
import GameEngine from "./game-engine.js";
import BingoBallDrawer from "./bingoball-drawer.js";
import BingoCaller from "./bingo-caller.js";
import BingoController from "./controller.js";
import Renderer from "./renderer.js";
import AutoDraw from "./auto-draw.js";
import BingoCardManager from "./card-manager.js";
import GridGenerator from "./grid-generator.js";
const cardManager = new BingoCardManager(new GridGenerator());
//const cards = cardManager.generateMultipleCards(config.gridSize, config.ranges, 100);
const card = cardManager.generateUniqueCard(config.gridSize, config.ranges);
//console.log(cards);

$(document).ready(async function() { 
    const engine = new GameEngine(config);
    const drawer = new BingoBallDrawer();
    const caller = new BingoCaller(drawer, engine, config.numberTexts);
    const renderer = new Renderer();
    const controller = new BingoController(engine, caller, renderer);
    controller.setCardManager(new BingoCardManager(new GridGenerator()));
    engine.dispatch("INIT"); // IDLE → READY
    const autoDraw = new AutoDraw(drawer, caller, engine);
    autoDraw.autoDrawAll();
});
