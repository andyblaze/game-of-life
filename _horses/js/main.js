import { CfgHorseGenetics } from "./cfg-horse-genetics.js";
import { CfgTrainer } from "./cfg-trainer.js";
import { CfgTrack } from "./cfg-track.js";
import { config } from "./cfg-main.js";
import WorldFactory from "./cls-world-factory.js";
import FormBook from "./cls-formbook.js";

function runSeason(numRaces, world, formbook) {
  for (let i = 0; i < numRaces; i++) {
    const race =  world.create("race", i);
    const results = race.run();
    formbook.addRaceResult(results);
  }
}  

$(document).ready(function() { 
const world = new WorldFactory();
world.create("tracks", config.numTracks, CfgTrack);
world.create("trainers", config.numTrainers, CfgTrainer);
world.create("horses", config.numHorses, CfgHorseGenetics);
const tracks = world.getTracks();
const trainers = world.getTrainers();
const horses = world.getHorses();
const formbook = new FormBook(tracks, trainers, horses);

runSeason(60, world, formbook);

/*const race =  world.create("race", 0);
const results = race.run();
formbook.addRaceResult(results);*/

console.log(formbook);

/*console.log("Race Results:"); 
results.forEach((r, i) => {
  console.log(`${i + 1}: ${r.horse.name}, Performance: ${r.performance.toFixed(2)}`);
});*/

});
