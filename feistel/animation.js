
export default class Animation {
    constructor(cnvs) {
        this.canvas = cnvs;
        this.ctx = cnvs.getContext("2d");
    }
    run(dt) {
        console.error("Must override BaseAnimation.run()");
    }
    to60Fps(s, dt) {
        return s * (dt / 16.67); // normalize to 60fps baseline
    }
}