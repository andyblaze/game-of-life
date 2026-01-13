export default class Renderer {
    constructor() {
        this.oldData = null;
        //this.oldStakes = os;
    }
    renderOdds(data, horses) { 
        let totalOdds = 0;
        let totalStakes = 0;
        let htm = `<table><tr><th>ID</th><th>Horse</th><th>Odds</th><th>Stakes</th><th>Movement</th></tr>`;
        for ( const horseId in data.odds ) {
            const o = data.odds[horseId].odds;
            let s = "";
            let movement = "";
            if ( this.oldData !== null ) {
                movement = this.oldData.odds[horseId].odds - o; console.log(this.oldData.odds[horseId].odds, o);
                s = "background:" + (movement < 0 ? "#ff0000" : "#00ff00");
            }
            const displayO = o.toFixed(2);
            const stake = data.stakes[horseId]; 
            htm += `<tr><td>${horseId}</td><td>${horses[horseId].name}</td>
                   <td>${displayO}</td><td>${stake}</td><td style="${s}">${movement}</td></tr>`;
            totalOdds += 1 / o;
            totalStakes += stake;
        }
        htm += `<tr><td></td><td>Total</td><td>${totalOdds.toFixed(2)}</td><td>${totalStakes}</td><td></td></tr>`;
        htm += "</table>";
        $("#odds").html(htm);
        this.oldData = {...data};
    }
}