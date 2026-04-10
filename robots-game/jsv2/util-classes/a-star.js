export default class Astar {
    constructor(grid) {
        this.tileGrid = grid;
        this.reset();
    }
    reset() {
        this.openSet = [];
        this.closedSet = new Set();
    }
    tileKey(t) {
        return `${t.row},${t.col}`;
    }
    buildPath(current) {
        const path = [];
        let c = current;
        while(c) {
            path.unshift(c.tile);
            c = c.parent;
        } 
        return path; // list of tiles from start -> end
    }
    createNode(tile1, tile2, gScore=0, tileParent=null) {
        const heur = this.heuristic(tile1, tile2);
        return {
            tile: tile1,
            g: gScore,
            h: heur,
            f: gScore + heur,
            parent: tileParent
        };
    }
    findPath(startTile, endTile) {
        this.reset();
        // Initialize start
        this.openSet.push(this.createNode(startTile, endTile));

        while( this.openSet.length > 0 ) {
            // Sort by f score
            this.openSet.sort((a,b) => a.f - b.f);
            const current = this.openSet.shift();
            this.closedSet.add(this.tileKey(current.tile));

            // Found the goal
            if ( current.tile === endTile ) {
                return this.buildPath(current);
            }

            // Check neighbors (N, S, E, W)
            const neighbors = this.getNeighbors(current.tile);
            this.checkNeighbors(neighbors, current, endTile);
        }
        // No path found
        return [];
    }
    checkNeighbors(neighbors, current, endTile) {
        for ( const neighbor of neighbors ) {
            if ( !neighbor.walkable ) continue;
            if ( this.closedSet.has(this.tileKey(neighbor)) ) continue;

            const gScore = current.g + 1; // all moves cost 1 for now
            let existing = this.openSet.find(n => n.tile === neighbor);

            if ( !existing ) {
                this.openSet.push(this.createNode(neighbor, endTile, gScore, current));
            } else if ( gScore < existing.g ) {
                existing.g = gScore;
                existing.f = gScore + existing.h;
                existing.parent = current;
            }
        }
    }
    heuristic(a, b) { // --- Heuristic: Manhattan distance ---
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }
    getNeighbors(tile) { // --- Get N/S/E/W neighbors ---
        const dirs = [
            [0,-1], // N
            [0,1],  // S
            [-1,0], // W
            [1,0]   // E
        ];
        const neighbors = [];
        for ( const [dc, dr] of dirs ) {
            const r = tile.row + dr;
            const c = tile.col + dc;
            if ( r >= 0 && r < this.tileGrid.rows && c >= 0 && c < this.tileGrid.columns ) {
                neighbors.push(this.tileGrid.tileAt(r, c));
            }
        }
        return neighbors;
    }
}