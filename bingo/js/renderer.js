export default class Renderer {
    constructor() {}

    renderCards(cards) {
        //console.log(card);
        const target = $("#bingocards");
        let htm = "";
        for ( const [idx, card] of cards.entries() ) {
        const grid = card.getGrid();
        htm += `<div class="bingocard" id="card${idx}">`;
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
        }
        target.html(htm);
       // }
    }
    markCards(n) { 
        $(".card"+n).addClass("marked");
    }
    markWinningLines(winners) { //console.log(winners);
        for ( let winner of winners ) {
        const winningLines = winner.card.getWinningLines();

        winningLines.forEach(line => {
            line.cells.forEach(({ col, row }) => {
                const cell = `#card${winner.index} .card${col}-${row}`;
                $(cell).addClass('winning');
            });
        });
        }
    }
    displayCall(text) {
        $("#caller-says").html(text);
    }
    showProfit(p) {
        $("#profit").html(p);
    }
}