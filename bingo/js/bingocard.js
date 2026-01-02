import { mt_rand } from "./functions.js"

export default class BingoCard {
    constructor() {
        this.grid = [];
        this.lookup = new Map();
        this.size = 5;
        this.generateGrid();
    }

    generateGrid() {
        const ranges = [
            { min: 1,  max: 15 },
            { min: 16, max: 30 },
            { min: 31, max: 45 },
            { min: 46, max: 60 },
            { min: 61, max: 75 }
        ];

        for (let col = 0; col < this.size; col++) {
            const numbers = [];

            while (numbers.length < this.size) {
                const n = mt_rand(ranges[col].min, ranges[col].max);
                if (!numbers.includes(n)) numbers.push(n);
            }

            numbers.sort((a, b) => a - b);

            for (let row = 0; row < this.size; row++) {
                if (!this.grid[row]) this.grid[row] = [];

                const cell = {
                    "column": col, 
                    "row": row,
                    "number": numbers[row],
                    "marked": false
                };

                this.grid[row][col] = cell;
                this.lookup.set(cell.number, cell);
            }
        }
        console.log(this.lookup);
    }
    mark(number) {
        const cell = this.lookup.get(number);
        if (!cell) return false;

        cell.marked = true;
        return true;
    }
    hasWinningColumn() {
        for (let row of this.grid) {
            const allMarked = row.every(cell => cell.marked === true);
            if ( allMarked ) {
                return true;
            }
        }
        return false;
    }
    getWinningColumn() {
        const winningCols = [];
        //const size = this.grid.length; // typically 5

        for (let colIndex = 0; colIndex < this.size; colIndex++) {
            let allMarked = true;
            for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
                if (!this.grid[colIndex][rowIndex].marked) {
                    allMarked = false;
                    break;
                }
            }
            if (allMarked) winningCols.push(colIndex);
        }

        return winningCols; // [] if none, array of indexes if some
    }
    hasWinningCorners() {
        const sz = this.size - 1;
        const tl = this.grid[0][0];
        const tr = this.grid[sz][0];
        const bl = this.grid[0][sz];
        const br = this.grid[sz][sz];

        return tl.marked && tr.marked && bl.marked && br.marked;
    }
    getWinningCorners() {
        const corners = [];
        const sz = this.size - 1;
        if ( this.grid[0][0].marked && this.grid[sz][0].marked &&
            this.grid[0][sz].marked && this.grid[sz][sz].marked ) {
                corners.push(this.grid[0][0]);
                corners.push(this.grid[sz][0]);
                corners.push(this.grid[0][sz]);
                corners.push(this.grid[sz][sz]);
        }
        return corners;
    }
   getGrid() {
        return this.grid;
    }
}
