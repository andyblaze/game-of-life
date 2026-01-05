export default class WinningLines {
    static get(size) { //console.log(size);
        const lines = [];

        // Rows
        for (let row = 0; row < size; row++) {
            const line = [];
            for (let col = 0; col < size; col++) {
                line.push({ col, row });
            }
            lines.push({ type: "row", index: row, cells: line });
        }

        // Columns
        for (let col = 0; col < size; col++) {
            const line = [];
            for (let row = 0; row < size; row++) {
                line.push({ col, row });
            }
            lines.push({ type: "column", index: col, cells: line });
        }

        // Main diagonal
        {
            const line = [];
            for (let i = 0; i < size; i++) {
                line.push({ col: i, row: i });
            }
            lines.push({ type: "diagonal", index: "main", cells: line });
        }

        // Anti-diagonal
        {
            const line = [];
            for (let i = 0; i < size; i++) {
                line.push({ col: size - 1 - i, row: i });
            }
            lines.push({ type: "diagonal", index: "anti", cells: line });
        }
        // Full card (blackout)
        {
            const line = [];
            for (let col = 0; col < size; col++) {
                for (let row = 0; row < size; row++) {
                    line.push({ col, row });
                }
            }
            lines.push({ type: "full", index: "all", cells: line });
        }
        // Four corners
        lines.push({
            type: "corners",
            index: "corners",
            cells: [
                { col: 0, row: 0 },
                { col: size-1, row: 0 },
                { col: 0, row: size-1 },
                { col: size-1, row: size-1 }
            ]
        });

        return lines;
    }
}