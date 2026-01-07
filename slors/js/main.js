import { config } from "./config.js";
import PayoutEvaluator from "./payout-evaluator.js";
import SlotMachine from "./slot-machine.js";
//import SpinSimulator from "./spin-simulator.js";

function spinReel(reel) {
  const index = Math.floor(Math.random() * reel.length);
  return reel[index];
}



$(document).ready(async function() { 
    const machine = new SlotMachine(new PayoutEvaluator(config), config);
    const payout = machine.spin();
    console.log(payout);
    //const sim = new SpinSimulator(100000, 1, config);
    //sim.log();
});
