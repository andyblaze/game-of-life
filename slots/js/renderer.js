export default class Renderer {
    constructor(animator) {
        this.animator = animator;
    }

    animateSpin(result) {
        return Promise.all([
            this.animator.animate(result)
        ]);
    }
    animatePayout(payout) {
        $("#payout").html(payout.amount);
        return Promise.resolve();
    }
}