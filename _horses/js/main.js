import { CfgHorseGenetics } from "./cfg-horse-genetics.js";
import { CfgTrainer } from "./cfg-trainer.js";
import { CfgTrack } from "./cfg-track.js";
import { config } from "./cfg-main.js";
import WorldFactory from "./cls-world-factory.js";
import FormBook from "./cls-formbook.js";
import Newspaper from "./cls-newspaper.js";

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
formbook.addObserver(new Newspaper());

runSeason(1000, world, formbook);
formbook.notify();

});
