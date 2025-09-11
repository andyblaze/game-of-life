// ---------------------
// Lightweight Voronoi (naive polygon clipping)
// ---------------------
export default class Voronoi {
    constructor(w, h) {
        this.screenW = w;
        this.screenH = h;
    }
    update(sites) {
        const cells = [];
        for ( let i = 0; i < sites.length; i++ ) {
            let cell = [
                {x:0,y:0}, {x:this.screenW, y:0}, {x:this.screenW, y:this.screenH}, {x:0, y:this.screenH}
            ];
            for ( let j = 0; j < sites.length; j++ ) {
                if ( i === j ) continue;
                cell = this.initNewCell(cell, sites[i], sites[j]);
                if ( ! cell.length ) break;
            }
            cells.push(cell);
        }
        return cells;
    }
    initNewCell(cell, site1, site2) {
        let sx = (site1.x + site2.x)/2;
        let sy = (site1.y + site2.y)/2;
        let dx = site2.x - site1.x;
        let dy = site2.y - site1.y;
        let nx = -dx, ny = -dy; // perpendicular
        let newCell=[];
        for ( let k = 0; k < cell.length; k++ ) {
            let a = cell[k], b = cell[(k + 1) % cell.length];
            let da = (a.x - sx) * nx + (a.y - sy) * ny;
            let db = (b.x - sx) * nx + (b.y - sy) * ny;
            if ( da >= 0 ) 
                newCell.push(a);
            if ( da * db < 0 ) {
                let t = da / (da - db);
                newCell.push({x:a.x + (b.x - a.x) * t, y:a.y + (b.y - a.y) * t});
            }
        }
        return newCell;
    }
}
