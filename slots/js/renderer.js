export default class Renderer {
    constructor(animator) {
        this.animator = animator;
    }
    renderRow(row) { //console.log(row);
        let htm = `<div class="payout-row"><span>${row.payout}</span>`;
        for ( let img of row.images ) {
            htm += `<img src="${img}" />`;
        }
        htm += "</div>";
        return htm;
    }
    drawPayouts(el, table) {
        let htm = "";
        table.forEach(row => htm += this.renderRow(row));
        el.html(htm);
    }
    animateSpin(result) {
        return Promise.all([
            this.animator.animate(result)
        ]);
    }
    animatePayout(payout) {
        return new Promise(resolve => {
            $("#payout").fadeOut(150, function () {
                $(this).html(payout.amount).fadeIn(150, resolve); // resolve AFTER fadeIn
            });
        });
    }
}