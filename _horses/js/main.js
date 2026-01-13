import { CfgHorseGenetics } from "./cfg-horse-genetics.js";
import { CfgTrainer } from "./cfg-trainer.js";
import { CfgTrack } from "./cfg-track.js";
import { config } from "./cfg-main.js";
import WorldFactory from "./cls-world-factory.js";
import FormBook from "./cls-formbook.js";
import Newspaper from "./cls-newspaper.js";
import Bookie from "./cls-bookie.js";
import FormApi from "./cls-formbook-api.js";
import Renderer from "./cls-renderer.js";
import { randomFrom, mt_rand } from "./functions.js";

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
const renderer = new Renderer();
formbook.addObserver(new Newspaper());

//runSeason(1000, world, formbook);
//formbook.notify();

/* generate form */
let data = {};
const bookie = new Bookie(0);
for ( let i = 0; i < 7; i++ ) {
let race =  world.create("race", i);
//data = bookie.priceRace(race, formAPI);

let results = race.run();
//bookie.settleRace(results.placings, data.odds);
formbook.addRaceResult(results);
}
/* run an actual race */
let race =  world.create("race", 9);
data = bookie.priceRace(race, formAPI);
const entrantIds = race.entrants.map(h => h.id);
for ( let n = 0; n < 20; n++ ) {
  const h = randomFrom(entrantIds);
  const b = mt_rand(1, 5)
  data = bookie.adjustOdds(h, b)
}
let results = race.run();
bookie.settleRace(results.placings, data.odds);
formbook.addRaceResult(results);
renderer.renderOdds(data, world.getHorses());
/*race =  world.create("race", i);
odds = bookie.priceRace(race, formAPI);
//console.log(odds);
results = race.run();
bookie.settleRace(results.placings, odds);
formbook.addRaceResult(results);
}*/
//console.log(bookie.getProfit());

});
