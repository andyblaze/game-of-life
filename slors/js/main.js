import { config } from "./config.js";
import SpinSimulator from "./spin-simulator.js";

function spinReel(reel) {
  const index = Math.floor(Math.random() * reel.length);
  return reel[index];
}



$(document).ready(async function() { 
    const sim = new SpinSimulator(100000, 1, config);
    sim.log();
});
