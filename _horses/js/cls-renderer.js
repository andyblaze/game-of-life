export default class Renderer {
    renderOdds(data, horses) { 
        let totalOdds = 0;
        let totalStakes = 0;
        let htm = `<table><tr><th>ID</th><th>Horse</th><th>Odds</th><th>Stakes</th></tr>`;
        for ( const horseId in data.odds ) {
            const o = data.odds[horseId].odds;
            const displayO = o.toFixed(2);
            const stake = data.stakes[horseId]; 
            htm += `<tr><td>${horseId}</td><td>${horses[horseId].name}</td><td>${displayO}</td><td>${stake}</td></tr>`;
            totalOdds += 1 / o;
            totalStakes += stake;
        }
        htm += `<tr><td></td><td>Total</td><td>${totalOdds.toFixed(2)}</td><td>${totalStakes}</td></tr>`;
        htm += "</table>";
        $("#odds").html(htm);
    }
}