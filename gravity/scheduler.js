import Effector from "./effector.js?h";
import SnapAbility from "./snap-ability.js";
import ZoomAbility from "./zoom-ability.js";
import BreatherAbility from "./breather-ability.js";
import { mt_rand, mt_rand_excluding_gap } from "./functions.js";

function addBreathers(canvas, effectors) {
    for ( let i = 0; i < 3; i++ ) {
        let e = new Effector(
                mt_rand(0, canvas.width), 
                mt_rand(0, canvas.height), 
                {width:canvas.width, height:canvas.height},
                mt_rand_excluding_gap(-0.9, 0, 0, 0.9)
            );
        e.addAbility(new BreatherAbility(e));
        effectors.push(e);
    }
}
function addEffectors(canvas, effectors) {
    for ( let i = 0; i < 8; i++ ) {
        effectors.push(new Effector(
            mt_rand(0, canvas.width), 
            mt_rand(0, canvas.height), 
            {width:canvas.width, height:canvas.height},
            mt_rand_excluding_gap(-10, -3, 3, 10)
        ));
    }
}
function addSnappers(canvas, effectors) {
    for ( let i = 0; i < 8; i++ ) {
        let e = new Effector(
            mt_rand(0, canvas.width), 
            mt_rand(0, canvas.height), 
            {width:canvas.width, height:canvas.height},
            mt_rand_excluding_gap(-10, -3, 3, 10)
        );
        e.addAbility(new SnapAbility(e));
        effectors.push(e);
    }
}
function addZoomers(canvas, effectors) {
    for ( let i = 0; i < 8; i++ ) {
        let e = new Effector(
            mt_rand(0, canvas.width), 
            mt_rand(0, canvas.height), 
            {width:canvas.width, height:canvas.height},
            mt_rand_excluding_gap(-10, -3, 3, 10)
        );
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
            {delay: 4000, func:addBreathers, done:false},
            {delay:16000, func:addEffectors, done:false}, 
            {delay:24000, func:addZoomers, done:false},
            {delay:36000, func:addSnappers, done:false}
        ];
    } 
    launch(elapsedTime) {
        if ( this.idx > this.waves.length -1 ) return;
        if ( this.waves[this.idx].done === false && elapsedTime > this.waves[this.idx].delay ) {
            this.waves[this.idx].func(this.canvas, this.effectors);
            this.waves[this.idx].done = true;
            this.idx++;
        }        
    }
}
