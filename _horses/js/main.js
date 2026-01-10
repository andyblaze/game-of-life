import { CfgHorseGenetics } from "./cfg-horse-genetics.js";
import { CfgTrainer } from "./cfg-trainer.js";
import { CfgTrack } from "./cfg-track.js";
import { config } from "./cfg-main.js";
import WorldFactory from "./cls-world-factory.js";
import FormBook from "./cls-formbook.js";

$(document).ready(function() { 
const world = new WorldFactory();
const tracks = world.create("tracks", config.numTracks, CfgTrack);
const trainers = world.create("trainers", config.numTrainers, CfgTrainer);
const horses = world.create("horses", config.numHorses, CfgHorseGenetics);
const formbook = new FormBook();

const race =  world.create("race", 0);
const results = race.run();
formbook.addRaceResult(results);

console.log(formbook);

/*console.log("Race Results:"); 
results.forEach((r, i) => {
  console.log(`${i + 1}: ${r.horse.name}, Performance: ${r.performance.toFixed(2)}`);
});*/

});
