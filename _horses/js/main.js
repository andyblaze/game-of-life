import { CfgHorseGenetics } from "./cfg-horse-genetics.js";
import { CfgTrainer } from "./cfg-trainer.js";
import { CfgNames } from "./cfg-names.js";
import Trainer from "./cls-trainer.js";
import Horse from "./cls-horse.js";
import { CfgTrack } from "./cfg-track.js";
import Track from "./cls-track.js";
import { config } from "./cfg-main.js";
import { randomFrom } from "./functions.js";
import Race from "./cls-race.js";

class WorldFactory {
    
}

function createTracks(num, cfg) {
    const result = [];
    for (let i = 0; i < num; i++) {
        const track = new Track(i, cfg, CfgNames.tracks[i]);
        result.push(track);
    }
    return result;
}
function createTrainers(num, cfg) {
    const result = [];
    for (let i = 0; i < num; i++) {
        const trainer = new Trainer(i, cfg, CfgNames.trainers[i]);
        result.push(trainer);
    }
    return result;
}
function createHorses(num, cfg, trainers) {
    const result = [];
    for (let i = 0; i < num; i++) {
        const trainer = trainers[i % trainers.length]; // round-robin
        const horse = new Horse(i, trainer.id, cfg, CfgNames.horses[i]);
        trainer.addHorse(horse);
        result.push(horse);
    }
    return result;
}

function createRace(id, tracks, horses, trainers) {
    const track = randomFrom(tracks);
    const distance = track.distance;
    const entrants = [];
    while ( entrants.length < 7 ) {
        const h = randomFrom(horses);
        if ( !entrants.includes(h) ) entrants.push(h);
    }
    return new Race(id, track, distance, entrants, trainers);
}

$(document).ready(function() { 
const tracks = createTracks(config.numTracks, CfgTrack);
const trainers = createTrainers(config.numTrainers, CfgTrainer);
const horses = createHorses(config.numHorses, CfgHorseGenetics, trainers);

const race = createRace(0, tracks, horses, trainers);
const results = race.run();

console.log("Race Results:");
results.forEach((r, i) => {
  console.log(`${i + 1}: ${r.horse.name}, Performance: ${r.performance.toFixed(2)}`);
});

});
