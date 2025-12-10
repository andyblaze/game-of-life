
export default class Animator {
    constructor(cnvs) {
        this.canvas = cnvs;
        this.ctx = cnvs.getContext("2d");
        this.animations = [];
        this.currentScene = -1;
    }
    notify(dt, elapsedTime) {
        for ( let a of this.animations )
            a.run(dt, elapsedTime);
    }
    add(animation) {
        this.currentScene++;
        this.animations.push(animation);
    }
    isSceneComplete() {
        return this.animations[this.currentScene].animationDone;
    }
}