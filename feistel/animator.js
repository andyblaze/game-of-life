
export class Animator {
    constructor(cnvs, ctx) {
        this.canvas = cnvs;
        this.ctx = ctx;
        this.animations = [];
    }
    notify(dt) {
        for ( let a of this.animations )
            a.run(dt);
    }
    add(animation) {
        this.animations.push(animation);
    }
}