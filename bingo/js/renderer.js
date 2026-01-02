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
                htm += `<div id="card${x}-${y}"><span id="card${number}">${number}</span></div>`;
            }
            htm += "<br>";
        }
        target.html(htm);
    }
    markCard(n) { 
        $("#card"+n).addClass("marked");
    }
    markWinningColumn(card) {
        const winningCol = card.getWinningColumn();

        winningCol.forEach(col => {
            for (let row = 0; row < card.getGrid()[0].length; row++) {
                const cellId = `#card${col}-${row}`;
                $(cellId).addClass('winning');
            }
        });
    }
    markWinningCorners(card) {
        const corners = card.getWinningCorners();
        corners.forEach(cell => {
            const col = cell.column;
            const row = cell.row;
            const cellId = `#card${col}-${row}`;
            $(cellId).addClass('winning');
        });
    }
}