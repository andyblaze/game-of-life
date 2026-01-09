import { CfgHorseGenetics } from "./cfg-horse-genetics.js";
import { CfgTrainer } from "./cfg-trainer.js";
import Trainer from "./cls-trainer.js";
import Horse from "./cls-horse.js";
import { CfgTrack } from "./cfg-track.js";
import Track from "./cls-track.js";

$(document).ready(function() { 
const tracks = [];

for (let i = 0; i < CfgTrack.count; i++) {
  const track = new Track(i, CfgTrack);
  tracks.push(track);
}

console.log(tracks);

const trainers = [];

// create trainers
for (let i = 0; i < CfgTrainer.count; i++) {
  const trainer = new Trainer(i, CfgTrainer);
  trainers.push(trainer);
}

// Example: assign 10 horses evenly to trainers
const horses = [];
const NUM_HORSES = 10;

for (let i = 0; i < NUM_HORSES; i++) {
  const trainer = trainers[i % trainers.length]; // round-robin
  const horse = new Horse(i, trainer.id, CfgHorseGenetics);
  trainer.addHorse(horse);
  horses.push(horse);
}

console.log(trainers);
console.log(horses);

});
