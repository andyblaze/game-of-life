import { config } from "./config.js";
import GameEngine from "./game-engine.js";
import SlotController from "./controller.js";
import PayoutEvaluator from "./payout-evaluator.js";
import SlotMachine from "./slot-machine.js";
import Renderer from "./renderer.js";
import ReelAnimator from "./reel-animator.js";
//import SpinSimulator from "./spin-simulator.js";

$(document).ready(function() { 
    const engine = new GameEngine(config);
    const machine = new SlotMachine(config);
    const evaluator = new PayoutEvaluator(config);
    const renderer = new Renderer(config);
    const controller = new SlotController(engine, machine, renderer, evaluator);
    $("#new-round").on("click", function() {
        engine.dispatch("SPIN");
    });
});
