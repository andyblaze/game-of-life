export default class Renderer {
    constructor() {}

    renderCard(card) {
        console.log(card);
        const target = $("#bingocard");
        const grid = card.getGrid();
        let htm = "";
        let number = 0;
        for ( let y = 0; y < 5; y++ ) {
            htm += `<div class="row">`;
            for ( let x = 0; x < 5; x++ ) {
                number = grid[x][y].number;
                htm += `
                <div class="cell" id="card${x}-${y}">
                    <span id="card${number}">${number}</span>
                </div>
            `;
            }
            htm += "</div>";
        }
        target.html(htm);
    }
    markCard(n) { 
        $("#card"+n).addClass("marked");
    }
    markWinningLines(card) {
        const winningLines = card.getWinningLines();

        winningLines.forEach(line => {
            line.cells.forEach(({ col, row }) => {
                const cellId = `#card${col}-${row}`;
                $(cellId).addClass('winning');
            });
        });
    }
    displayCall(text) {
        $("#caller-says").html(text);
    }
}