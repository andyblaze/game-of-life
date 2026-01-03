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
    markWinningColumn(card) {
        const winningCol = card.getWinningColumn();

        winningCol.forEach(col => {
            for (let row = 0; row < card.getGrid()[0].length; row++) {
                const cellId = `#card${col}-${row}`;
                $(cellId).addClass('winning');
            }
        });
    }
markWinningDiagonal(card) {
    const diagonals = card.getWinningDiagonals();
    const size = card.getGrid().length;

    diagonals.forEach(diagonal => {
        for (let i = 0; i < size; i++) {
            let col, row;

            if (diagonal === "main") {
                col = i;
                row = i;
            } else if (diagonal === "anti") {
                col = size - 1 - i;
                row = i;
            }

            const cellId = `#card${col}-${row}`;
            $(cellId).addClass('winning');
        }
    });
}

    markWinningRow(card) {
        const winningRows = card.getWinningRow();

        winningRows.forEach(row => {
            for (let col = 0; col < card.getGrid().length; col++) {
                const cellId = `#card${col}-${row}`;
                $(cellId).addClass('winning');
            }
        });
    }
    markWinningCorners(card) {
        const corners = card.getWinningCorners();
        corners.forEach(cell => {
            const col = cell.col;
            const row = cell.row;
            const cellId = `#card${col}-${row}`;
            $(cellId).addClass('winning');
        });
    }
}