import GridGenerator from "./grid-generator.js";
import WinningLines from "./winning-lines.js";

export default class BingoCard {
    constructor(props) {
        const {grid, lookup} = props;
        this.grid = grid;
        this.lookup = lookup;
        //this.numberGrid = numberGrid;
        this.size = this.grid[0].length;
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
