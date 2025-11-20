import Effector from "./effector.js?h";
import SnapAbility from "./snap-ability.js";
import ZoomAbility from "./zoom-ability.js";
import BreatherAbility from "./breather-ability.js";
import { mt_rand, mt_rand_excluding_gap, canvasSize } from "./functions.js";

function randomPosIn(cnvs) {
    return {x: mt_rand(0, cnvs.width), y: mt_rand(0, cnvs.height)};
}

function randomStrength(mid, high) {
    return mt_rand_excluding_gap(-high, -mid, mid, high);
}

class EffectorFactory {
    static create(canvas, mid, high) {
        const {x, y} = {...randomPosIn(canvas)};
        return new Effector(
            x, y, 
            canvasSize(canvas),
            randomStrength(mid, high)
        );
    }
}

function addBreathers(n, canvas, effectors) {
    for ( let i = 0; i < n; i++ ) {
        let e = EffectorFactory.create(canvas, 0, 0.9);
        e.addAbility(new BreatherAbility(e));
        effectors.push(e);
    }
}
function addEffectors(n, canvas, effectors) {
    for ( let i = 0; i < n; i++ ) {
        effectors.push(EffectorFactory.create(canvas, 3, 10));
    }
}
function addSnappers(n, canvas, effectors) {
    for ( let i = 0; i < n; i++ ) {
        let e = EffectorFactory.create(canvas, 3, 10);
        e.addAbility(new SnapAbility(e));
        effectors.push(e);
    }
}
function addZoomers(n, canvas, effectors) {
    for ( let i = 0; i < n; i++ ) {
        let e = EffectorFactory.create(canvas, 3, 10);
        e.addAbility(new ZoomAbility(e));
        effectors.push(e);
    }
}

export default class Scheduler {
    constructor(c, effs) {
        this.canvas = c;
        this.effectors = effs;
        this.idx = 0;
        this.waves = [
            {delay: 4000, func:addBreathers, done:false, num:3},
            {delay:16000, func:addEffectors, done:false, num:8}, 
            {delay:24000, func:addZoomers, done:false, num:8},
            {delay:36000, func:addSnappers, done:false, num:8}
        ];
    } 
    launch(elapsedTime) {
        if ( this.idx > this.waves.length -1 ) return;
        const wave = this.waves[this.idx];
        if ( wave.done === false && elapsedTime > wave.delay ) {
            wave.func(wave.num, this.canvas, this.effectors);
            wave.done = true;
            this.idx++;
        }        
    }
}
