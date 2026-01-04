import GridGenerator from "./grid-generator.js";
import WinningLines from "./winning-lines.js";

export default class BingoCard {
    constructor(size=5) {
        this.size = size;
        this.ranges = [
            { min: 1,  max: 15 },
            { min: 16, max: 30 },
            { min: 31, max: 45 },
            { min: 46, max: 60 },
            { min: 61, max: 75 }
        ];
        const {grid, lookup} = GridGenerator.generate(this.size, this.ranges);
        this.grid = grid;
        this.lookup = lookup;
    }
    getAllLines() {
        return WinningLines.get(this.size);
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
