import { mt_rand } from "./functions.js"

export default class BingoCard {
    constructor() {
        this.grid = [];
        this.lookup = new Map();
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

        for (let col = 0; col < 5; col++) {
            const numbers = [];

            while (numbers.length < 5) {
                const n = mt_rand(ranges[col].min, ranges[col].max);
                if (!numbers.includes(n)) numbers.push(n);
            }

            numbers.sort((a, b) => a - b);

            for (let row = 0; row < 5; row++) {
                if (!this.grid[row]) this.grid[row] = [];

                const cell = {
                    number: numbers[row],
                    marked: false
                };

                this.grid[row][col] = cell;
                this.lookup.set(cell.number, cell);
            }
        }
    }
    mark(number) {
        const cell = this.lookup.get(number);
        if (!cell) return false;

        cell.marked = true;
        return true;
    }
    hasWinningColumn()() {
        for (let row of this.grid) {
            const allMarked = row.every(cell => cell.marked === true);
            if ( allMarked ) {
                return true;
            }
        }
        return false;
    }
    getGrid() {
        return this.grid;
    }
}
