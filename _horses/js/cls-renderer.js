export default class Renderer {
    renderOdds(odds, horses) {
        let htm = `<table border="1" cellpadding="8"><tr><th>Horse</th><th>Odds</th></tr>`;
        for ( const horseId in odds ) {
            htm += `<tr><td>${horses[horseId].name}</td><td>${odds[horseId].odds}</td></tr>`;
        }
        htm += "</table>";
        $("#odds").html(htm);
    }
}