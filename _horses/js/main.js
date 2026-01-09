import { CfgHorseGenetics } from "./cfg-horse-genetics.js";
import { CfgTrainer } from "./cfg-trainer.js";
import Trainer from "./cls-trainer.js";
import Horse from "./cls-horse.js";
import { CfgTrack } from "./cfg-track.js";
import Track from "./cls-track.js";
import { config } from "./cfg-main.js";

function createTracks(num, cfg) {
    const result = [];
    for (let i = 0; i < num; i++) {
        const track = new Track(i, cfg);
        result.push(track);
    }
    return result;
}
function createTrainers(num, cfg) {
    const result = [];
    for (let i = 0; i < num; i++) {
        const trainer = new Trainer(i, cfg);
        result.push(trainer);
    }
    return result;
}
function createHorses(num, cfg, trainers) {
    const result = [];
    for (let i = 0; i < num; i++) {
        const trainer = trainers[i % trainers.length]; // round-robin
        const horse = new Horse(i, trainer.id, cfg);
        trainer.addHorse(horse);
        result.push(horse);
    }
    return result;
}

$(document).ready(function() { 
const tracks = createTracks(config.numTracks, CfgTrack);
console.log(tracks);

const trainers = createTrainers(config.numTrainers, CfgTrainer);
console.log(trainers);

// Example: assign horses evenly to trainers
const horses = createHorses(config.numHorses, CfgHorseGenetics, trainers);
console.log(horses);

});
