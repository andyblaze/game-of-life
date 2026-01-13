export default class Renderer {
    renderOdds(odds, horses) {
        let total = 0;
        let htm = `<table><tr><th>Horse</th><th>Odds</th></tr>`;
        for ( const horseId in odds ) {
            htm += `<tr><td>${horses[horseId].name}</td><td>${odds[horseId].odds}</td></tr>`;
            total += 1 / odds[horseId].odds;
        }
        htm += `<tr><td>Total</td><td>${total}</td></tr>`;
        htm += "</table>";
        $("#odds").html(htm);
    }
}