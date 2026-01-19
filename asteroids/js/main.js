import GameScreen from "./gamescreen.js";
import Game from "./game.js";

$(document).ready(function() {
    const game = new Game(new GameScreen("#screen"));
});