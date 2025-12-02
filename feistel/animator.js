
export default class Animator {
    constructor(cnvs) {
        this.canvas = cnvs;
        this.ctx = cnvs.getContext("2d");
        this.animations = [];
    }
    notify(dt, elapsedTime) {
        for ( let a of this.animations )
            a.run(dt, elapsedTime);
    }
    add(animation) {
        this.animations.push(animation);
    }
}