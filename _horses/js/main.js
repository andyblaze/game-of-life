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

$(document).ready(function() { 
const tracks = createTracks(config.numTracks, CfgTrack);

/*for (let i = 0; i < config.numTracks; i++) {
  const track = new Track(i, CfgTrack);
  tracks.push(track);
}*/

console.log(tracks);

const trainers = createTrainers(config.numTrainers, CfgTrainer);
// create trainers
/*for (let i = 0; i < config.numTrainers; i++) {
  const trainer = new Trainer(i, CfgTrainer);
  trainers.push(trainer);
}*/

console.log(trainers);

// Example: assign horses evenly to trainers
const horses = [];

for (let i = 0; i < config.numHorses; i++) {
  const trainer = trainers[i % trainers.length]; // round-robin
  const horse = new Horse(i, trainer.id, CfgHorseGenetics);
  trainer.addHorse(horse);
  horses.push(horse);
}


console.log(horses);

});
