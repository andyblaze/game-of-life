import ReelAnimator from "./reel-animator.js";

export default class Renderer {
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
/*animators[0].spinTo(14);
animators[1].spinTo(4);
animators[2].spinTo(19);*/
    }

    animateSpin(result) {
        return Promise.all([
        this.animators[0].spinTo(result[0]),
        this.animators[1].spinTo(result[1]),
        this.animators[2].spinTo(result[2])
        ]);
    }
    animatePayout(payout) {
        $("#payout").html(payout.amount);
        return Promise.resolve();
    }
}