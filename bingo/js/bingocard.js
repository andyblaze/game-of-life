import { mt_rand } from "./functions.js"

export default class BingoCard {
    constructor() {
        this.grid = [];
        this.lookup = new Map();
        this.size = 5;
        this.ranges = [
            { min: 1,  max: 15 },
            { min: 16, max: 30 },
            { min: 31, max: 45 },
            { min: 46, max: 60 },
            { min: 61, max: 75 }
        ];
        this.generateGrid(this.size, this.ranges);
    }

    generateGrid(size, ranges) {
        this.grid = Array.from({ length:size }, () => Array(size).fill(null));

        for (let row = 0; row < size; row++) {
            const numbers = [];

            while ( numbers.length < size ) {
                const n = mt_rand(ranges[row].min, ranges[row].max);
                if ( ! numbers.includes(n) ) numbers.push(n);
            }

            numbers.sort((a, b) => a - b);

            for ( let col = 0; col < size; col++ )  {
                const cell = {
                    "col": col, 
                    "row": row,
                    "number": numbers[col],
                    "marked": false
                };
                this.grid[col][row] = cell;
                this.lookup.set(cell.number, cell);
            }
        }
    }
    getAllLines() {
        const size = this.size;
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
            cells: [
                { col: 0, row: 0 },
                { col: size-1, row: 0 },
                { col: 0, row: size-1 },
                { col: size-1, row: size-1 }
            ]
        });

        return lines;
    }
    isLineWinning(line) {
        return line.cells.every(
            ({ col, row }) => this.grid[col][row].marked
        );
    }
    getWinningLines() {
        return this.getAllLines().filter(line => this.isLineWinning(line));
    }
    hasWinningLine() {
        return this.getWinningLines().length > 0;
    }
    getGrid() {
        return this.grid;
    }
    mark(number) {
        const cell = this.lookup.get(number);
        if (!cell) return false;

        cell.marked = true;
        return true;
    }
}
