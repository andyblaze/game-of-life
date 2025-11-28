
export class Animator {
    constructor(cnvs, ctx) {
        this.canvas = cnvs;
        this.ctx = ctx;
        this.animations = [];
    }
    notify() {
        for ( let a of this.animations )
            a.run();
    }
    add(animation) {
        this.animations.push(animation);
    }
}