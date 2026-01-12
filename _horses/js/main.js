import { CfgHorseGenetics } from "./cfg-horse-genetics.js";
import { CfgTrainer } from "./cfg-trainer.js";
import { CfgTrack } from "./cfg-track.js";
import { config } from "./cfg-main.js";
import WorldFactory from "./cls-world-factory.js";
import FormBook from "./cls-formbook.js";
import Newspaper from "./cls-newspaper.js";
import Bookie from "./cls-bookie.js";
import FormApi from "./cls-formbook-api.js";

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
const formAPI = new FormApi(formbook);
formbook.addObserver(new Newspaper());

//runSeason(1000, world, formbook);
//formbook.notify();
const bookie = new Bookie(0);
for ( let i = 0; i < 500; i++ ) {
let race =  world.create("race", i);
let odds = bookie.priceRace(race, formAPI);
//console.log(odds);
let results = race.run();
bookie.settleRace(results.placings, odds);
formbook.addRaceResult(results);
race =  world.create("race", i);
odds = bookie.priceRace(race, formAPI);
//console.log(odds);
results = race.run();
bookie.settleRace(results.placings, odds);
formbook.addRaceResult(results);
}
console.log(bookie.getProfit());

});
