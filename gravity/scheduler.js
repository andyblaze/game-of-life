import Effector from "./effector.js?h";
import SnapAbility from "./snap-ability.js";
import ZoomAbility from "./zoom-ability.js";
import BreatherAbility from "./breather-ability.js";
import { mt_rand, mt_rand_excluding_gap, canvasSize, randomPosIn } from "./functions.js";

const AbilityRegistry = {
    breather: (eff) => new BreatherAbility(eff),
    zoomer:   (eff) => new ZoomAbility(eff),
    snapper:  (eff) => new SnapAbility(eff)
    // add more here...
};

class EffectorFactory {
    static create(canvas, mid, high, abilityName=null) {
        const {x, y} = {...randomPosIn(canvas)};
        const e = new Effector(
            x, y, 
            canvasSize(canvas),
            EffectorFactory.randomStrength(mid, high)
        );
        // attach ability if requested
        if ( null !== abilityName && AbilityRegistry[abilityName]) {
            e.addAbility(AbilityRegistry[abilityName](e));
        }
        return e;
    }
    static randomStrength(mid, high) {
        return mt_rand_excluding_gap(-high, -mid, mid, high);
    }
}

export default class Scheduler {
    constructor(c, effs) {
        this.canvas = c;
        this.effectors = effs;
        this.idx = 0;
        this.waves = [
            {delay: 4000, done:false, num:3, strength: {lo:0, hi:0.9}, type: "breather"},
            {delay:16000, done:false, num:8, strength: {lo:4, hi:7},  type: "zoomer"},
            {delay:24000, done:false, num:8, strength: {lo:8, hi:11},  type: "zoomer"},
            {delay:36000, done:false, num:2, strength: {lo:3, hi:6},   type: null}, 
            {delay:48000, done:false, num:2, strength: {lo:5, hi:8},   type: null}, 
            {delay:56000, done:false, num:2, strength: {lo:4, hi:7},   type: "snapper"},
            {delay:64000, done:false, num:2, strength: {lo:7, hi:10},  type: "snapper"}
        ];
    } 
    addEffectors(n, ability, strength) {
        const {lo, hi} = {...strength};
        for ( let i = 0; i < n; i++ ) {
            this.effectors.push(EffectorFactory.create(this.canvas, lo, hi, ability));
        }
    }
    launch(elapsedTime) {
        if ( this.idx > this.waves.length -1 ) return;
        const wave = this.waves[this.idx];
        if ( wave.done === false && elapsedTime > wave.delay ) {
            this.addEffectors(wave.num, wave.type, wave.strength);
            wave.done = true;
            this.idx++;
        }        
    }
}
