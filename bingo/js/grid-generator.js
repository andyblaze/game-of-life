import { mt_rand } from "./functions.js";

export default class GridGenerator {
    static generate(size, ranges) {
       let grid = Array.from({ length:size }, () => Array(size).fill(null));
       let lookup = new Map();

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
                grid[col][row] = cell;
                lookup.set(cell.number, cell);
            }
        }
        return { grid, lookup };
    }
}