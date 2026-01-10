import { CfgNames } from "./cfg-names.js";
import Trainer from "./cls-trainer.js";
import Horse from "./cls-horse.js";
import Track from "./cls-track.js";
import { randomFrom } from "./functions.js";
import Race from "./cls-race.js";

//console.log("Horse.type in main:", Horse.type);

const ObjectRegistry = {
    [Trainer.type]: Trainer,
    [Horse.type]: Horse,
    [Track.type]: Track,
    [Race.type]: Race
}; 
export default class WorldFactory {
    constructor() {
        this.repository = {};
    }
    getType(type) {
        const T = ObjectRegistry[type];
        if ( ! T ) 
            throw new Error(`Unknown type: ${type}`);
        return T;
    }
    create(type, num, cfg) {
        if ( type === "horses" ) return this.createHorses(type, num, cfg);
        if ( type === "race" ) return this.createRace(type, num);
        const T = this.getType(type);
        const result = [];
        for (let i = 0; i < num; i++) {
            const item = new T(i, cfg, CfgNames.tracks[i]);
            result.push(item);
        }
        this.repository[type] = result;
        return this.repository[type];    
    }
    createHorses(type, num, cfg) {
        const T = this.getType(type);
        const result = [];
        const trainers = this.repository["trainers"];
        for (let i = 0; i < num; i++) {
            const trainer = trainers[i % trainers.length]; // round-robin
            const item = new T(i, trainer.id, cfg, CfgNames.horses[i]);
            trainer.addHorse(item);
            result.push(item);
        }
        this.repository[type] = result;
        return this.repository[type];    
    }
    createRace(type, id) {
        const T = this.getType(type);
        const trainers = this.repository["trainers"];
        const horses = this.repository["horses"];
        const tracks = this.repository["tracks"];
        const track = randomFrom(tracks);
        const distance = track.distance;
        const entrants = [];
        while ( entrants.length < 7 ) {
            const h = randomFrom(horses);
            if ( !entrants.includes(h) ) entrants.push(h);
        }
        return new T(id, track, distance, entrants, trainers);
    }
}