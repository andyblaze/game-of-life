export default class Renderer {
    constructor() {}

    renderCard(card) {
        //console.log(card);
        const target = $("#bingocards");
        const grid = card.getGrid();
        let htm = `<div class="bingocard">`;
        let number = 0;
        for ( let y = 0; y < 5; y++ ) {
            htm += `<div class="row">`;
            for ( let x = 0; x < 5; x++ ) {
                number = grid[x][y].number;
                htm += `
                <div class="cell card${x}-${y}">
                    <span class="card${number}">${number}</span>
                </div>
            `;
            }
            htm += "</div>";
        }
        htm += "</div>";
        target.html(htm);
    }
    markCard(n) { 
        $(".card"+n).addClass("marked");
    }
    markWinningLines(card) {
        const winningLines = card.getWinningLines();

        winningLines.forEach(line => {
            line.cells.forEach(({ col, row }) => {
                const cell = `.card${col}-${row}`;
                $(cell).addClass('winning');
            });
        });
    }
    displayCall(text) {
        $("#caller-says").html(text);
    }
}