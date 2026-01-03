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
    hasWinningRow() {
        for (let row = 0; row < 5; row++) {
            let allMarked = true;

            for (let col = 0; col < 5; col++) {
                if (!this.grid[col][row].marked) {
                    allMarked = false;
                    break;
                }
            }

            if (allMarked) {
                return true;
            }
        }
        return false;
    }
    getWinningRow() {
        const winningRows = [];

        for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
            let allMarked = true;

            for (let colIndex = 0; colIndex < this.size; colIndex++) {
                if (!this.grid[colIndex][rowIndex].marked) {
                    allMarked = false;
                    break;
                }
            }

            if (allMarked) winningRows.push(rowIndex);
        }

        return winningRows; // [] if none, array of row indexes if some
    }

    /*
    hasWinningRow() {
    for (let row = 0; row < 5; row++) {
        const allMarked = this.grid.every(col => col[row].marked);
        if (allMarked) {
            return true;
        }
    }
    return false;
}*/
    hasWinningColumn() {
        for ( let row of this.grid ) {
            const allMarked = row.every(cell => cell.marked === true);
            if ( allMarked ) {
                return true;
            }
        }
        return false;
    }
    getWinningColumn() {
        const winningCols = [];
        for ( let colIndex = 0; colIndex < this.size; colIndex++ ) {
            let allMarked = true;
            for ( let rowIndex = 0; rowIndex < this.size; rowIndex++ ) {
                if (!this.grid[colIndex][rowIndex].marked) {
                    allMarked = false;
                    break;
                }
            }
            if (allMarked) winningCols.push(colIndex);
        }
        return winningCols; // [] if none, array of indexes if some
    }
hasWinningDiagonals() {
    const size = this.size;

    // Main diagonal (top-left → bottom-right)
    let mainMarked = true;
    for (let i = 0; i < size; i++) {
        if (!this.grid[i][i].marked) {
            mainMarked = false;
            break;
        }
    }
    if (mainMarked) return true;

    // Anti-diagonal (top-right → bottom-left)
    let antiMarked = true;
    for (let i = 0; i < size; i++) {
        if (!this.grid[size - 1 - i][i].marked) {
            antiMarked = false;
            break;
        }
    }

    return antiMarked;
}
getWinningDiagonals() {
    const winningDiagonals = [];
    const size = this.size;

    // Main diagonal (top-left → bottom-right)
    let mainMarked = true;
    for (let i = 0; i < size; i++) {
        if (!this.grid[i][i].marked) {
            mainMarked = false;
            break;
        }
    }
    if (mainMarked) winningDiagonals.push("main");

    // Anti-diagonal (top-right → bottom-left)
    let antiMarked = true;
    for (let i = 0; i < size; i++) {
        if (!this.grid[size - 1 - i][i].marked) {
            antiMarked = false;
            break;
        }
    }
    if (antiMarked) winningDiagonals.push("anti");

    return winningDiagonals; // [], ["main"], ["anti"], or ["main","anti"]
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
    mark(number) {
        const cell = this.lookup.get(number);
        if (!cell) return false;

        cell.marked = true;
        return true;
    }
}
