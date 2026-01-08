import { config } from "./config.js";
import GameEngine from "./game-engine.js";
import SlotController from "./controller.js";
import PayoutEvaluator from "./payout-evaluator.js";
import SlotMachine from "./slot-machine.js";
import Renderer from "./renderer.js";
import ReelsAnimator from "./reels-animator.js";
import PayoutTableBuilder from "./payout-table.js";
import SpinSimulator from "./spin-simulator.js";

$(document).ready(function() { 
    //const sim = new SpinSimulator(100000, 1, config);
    //sim.log(); return;
    const table = new PayoutTableBuilder(config).build();
    const engine = new GameEngine(config);
    const machine = new SlotMachine(config);
    const evaluator = new PayoutEvaluator(config);
    const renderer = new Renderer(new ReelsAnimator(config));
    renderer.drawPayouts($("#payout-table"), table);
    const controller = new SlotController(engine, machine, renderer, evaluator);
    $("#new-round").on("click", function() {
        engine.dispatch("SPIN");
    });
    engine.dispatch("SPIN");
});
