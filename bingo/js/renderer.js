export default class Renderer {
    constructor() {}

    renderCard(card) {
        console.log(card);
        const target = $("#bingocard");
        const grid = card.grid;
        let htm = "";
        let number = 0;
        for ( let y = 0; y < 5; y++ ) {
            for ( let x = 0; x < 5; x++ ) {
                number = grid[x][y].number;
                htm += `<div id="card${number}">${number}</div>`;
            }
            htm += "<br>";
        }
        target.html(htm);
    }
    markCard(n) { 
        $("#card"+n).addClass("marked");
    }
}