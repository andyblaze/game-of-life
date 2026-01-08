export default class Renderer {
    constructor(animator) {
        this.animator = animator;
    }
    renderRow(row) {
        console.log(row);
    }
    drawPayouts(el, table) {
        table.forEach(row => this.renderRow(row));
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