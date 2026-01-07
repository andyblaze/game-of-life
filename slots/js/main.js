import { config } from "./config.js";
import PayoutEvaluator from "./payout-evaluator.js";
import SlotMachine from "./slot-machine.js";
//import SpinSimulator from "./spin-simulator.js";

$(document).ready(async function() { 
    const machine = new SlotMachine(config);
    const evaluator = new PayoutEvaluator(config);
    const result = machine.spin();
    const payout = evaluator.evaluate(result);
    console.log(result, payout); //  line, 
    //const sim = new SpinSimulator(100000, 1, config);
    //sim.log();
});
