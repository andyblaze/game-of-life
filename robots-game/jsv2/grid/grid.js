import Tile from "./tile.js";
import { randomFrom } from "../functions.js";

export default class Grid {
    constructor(cfg) {
        this.tileSize = cfg.tileSize;
        this.width = cfg.width;
        this.height = cfg.height;
        this.grid = [];
        this.columns = 0;
        this.rows = 0;
        this.init();
    }
    init() {
        this.columns = Math.ceil(this.width / this.tileSize);
        this.rows = Math.ceil(this.height / this.tileSize);
        this.grid = Array.from({ length: this.rows }, (_, row) => 
            Array.from({ length: this.columns }, (_, col) => new Tile(row, col))
        );    
    }
    calcSizes(x, y, r) {
        return {
            startCol: Math.max(0, Math.floor((x-r) / this.tileSize)),
            endCol: Math.min(this.columns-1, Math.floor((x+r) / this.tileSize)),
            startRow: Math.max(0, Math.floor((y-r) / this.tileSize)),
            endRow: Math.min(this.rows-1, Math.floor((y + r) / this.tileSize))
        };
    }
    isFreeAt(x, y, r) {
        const { startCol, endCol, startRow, endRow } = this.calcSizes(x, y, r);
        for( let row=startRow; row<=endRow; row++ ) {
            for( let col=startCol; col<=endCol; col++ ) {
                const tile = this.grid[row][col];
                if ( tile.isUsed() ) return false;
            }
        }
        return true;
    }
    occupy(x, y, r, type) {
        const { startCol, endCol, startRow, endRow } = this.calcSizes(x, y, r);
        for( let row=startRow; row<=endRow; row++ ) {
            for( let col=startCol; col<=endCol; col++ ) {
                const tile = this.grid[row][col];
                tile.setType(type);
            }
        }
    }
    getTileAtPixel(x, y) {
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        if (row < 0 || row >= this.rows || col < 0 || col >= this.columns) return null;
        return this.grid[row][col];
    }
    tileAt(row, col) {
        return this.grid[row][col];
    }
    randomWalkableTiles(n) {
        const walkable = [];
        // collect all walkable tiles
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const tile = this.grid[row][col];
                if (tile.isWalkable()) {
                    walkable.push(tile);
                }
            }
        }
        // shuffle (Fisher-Yates)
        for (let i = walkable.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [walkable[i], walkable[j]] = [walkable[j], walkable[i]];
        }
        // return first n (or all if not enough)
        return walkable.slice(0, n);
    }
    randomTile(type = null) {
        const tiles = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                const tile = this.grid[r][c];
                // skip ponds always
                if (tile.getType() === "pond") 
                    continue;
                if ( tile.isOccupied() )
                    continue;
                // if type specified, enforce it
                if (type && tile.getType() !== type) 
                    continue;
                tiles.push(tile);
            }
        }
        if (tiles.length === 0) return null;
        return randomFrom(tiles);
    }
}