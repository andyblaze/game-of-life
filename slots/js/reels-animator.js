import ReelAnimator from "./reel-animator.js";

export default class ReelsAnimator {
    constructor(config) {
        this.animators = [];
        this.animators.push(new ReelAnimator({
            reel: config.reels.reel1,
            $reelEl: $("#reel1"),
            symbolMap: config.symbolMap
        })); 
        this.animators.push(new ReelAnimator({
            reel: config.reels.reel2,
            $reelEl: $("#reel2"),
            symbolMap: config.symbolMap
        })); 
        this.animators.push(new ReelAnimator({
            reel: config.reels.reel3,
            $reelEl: $("#reel3"),
            symbolMap: config.symbolMap
        })); 
    }
    animate(result) {
        this.animators[0].spinTo(result[0]);
        this.animators[1].spinTo(result[1]);
        this.animators[2].spinTo(result[2]);       
    }
}