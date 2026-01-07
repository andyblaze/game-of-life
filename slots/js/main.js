import { config } from "./config.js";
import GameEngine from "./game-engine.js";
import SlotController from "./controller.js";
import PayoutEvaluator from "./payout-evaluator.js";
import SlotMachine from "./slot-machine.js";
import Renderer from "./renderer.js";
//import SpinSimulator from "./spin-simulator.js";

$(document).ready(function() { 
    const engine = new GameEngine(config);
    const machine = new SlotMachine(config);
    const evaluator = new PayoutEvaluator(config);
    const renderer = new Renderer();
    const controller = new SlotController(engine, machine, renderer, evaluator);
    $("#new-round").on("click", function() {
        engine.dispatch("SPIN");
    });
    //const result = machine.spin();
    //const payout = evaluator.evaluate(result);
    //console.log(result, payout); //  line, 
    //const sim = new SpinSimulator(100000, 1, config);
    //sim.log();
});
