function wavePath(config, freq, steps) {
    const cx = config.W / 2;
    const cy = config.H / 2;
    const radius = Math.min(config.W, config.H) / 3;    
    const path = [];
    for (let i=0; i<steps; i++) {
        const angle = (i / steps) * Math.PI*2;
        const r = radius * (0.5 + 0.5*Math.sin(angle*freq));
        const x = cx + r * Math.cos(angle*3.1);
        const y = cy + r * Math.sin(angle*2.7);
        path.push([x, y]);
    }
    return path;
}

function spiralPath(config, turns, points) {
    const cx = config.W / 2;
    const cy = config.H / 2;
    const radius = Math.min(config.W, config.H) / 3;
    const path = [];
    for ( let i = 0; i < points; i++ ) {
        const t = i / points;
        const angle = t * turns * 2 * Math.PI;
        const r = t * radius;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        path.push([x, y]);
    }
    return path;
}

class Shape {
    constructor(config) {
        this.cx = config.W / 2;
        this.cy = config.H / 2;       
    }
    autoRadius(divisor) {
        this.radius = Math.min(config.W, config.H) / divisor;
        return this.radius;
    } 
    setCx(x) {
        this.cx += x;
        this.vertices = this.computeVertices();
        return this;
    }
    computeVertices()  {}
}
class PathShape {
    constructor(generatorFn, ...params) {
        this.vertices = generatorFn(...params);
    }
    getVertices() {
        // return a copy to avoid accidental mutation
        return this.vertices.map(v => [...v]);
    }
}

class Line extends Shape {
    constructor(config, length = 200) {
        super(config)
        this.length = length;
        this.vertices = this.computeVertices();
    }
    computeVertices() {
        return [
            [this.cx - this.length / 2, this.cy],
            [this.cx + this.length / 2, this.cy],
        ];
    }
    getVertices() {
        return this.vertices.map(([x, y]) => [x, y]);
    }
}

class Triangle extends Shape {
    constructor(config) {
        super(config);
        this.autoRadius(4);
        this.vertices = this.computeVertices();
    }
    computeVertices() {
        const verts = [];
        for ( let i = 0; i < 3; i++ ) {
            const angle = i * (2 * Math.PI / 3);
            const x = this.cx + Math.cos(angle) * this.radius;
            const y = this.cy + Math.sin(angle) * this.radius;
            verts.push([x, y]);
        }
        return verts;
    }
    getVertices() {
        return this.vertices.map(v => [...v]); // return a copy to avoid mutation
    }
}

class Star extends Shape {
    constructor(config, points = 5) {
        super(config);
        this.radiusOuter = Math.min(config.W, config.H) / 4;
        this.radiusInner = this.radiusOuter * 0.5; // inner points of star
        this.points = points;
        this.vertices = this.computeVertices();
    }
    computeVertices() {
        const verts = [];
        const total = this.points * 2; // outer + inner
        for (let i = 0; i < total; i++) {
            const angle = i * (Math.PI / this.points); // π / points = half angle step
            const r = (i % 2 === 0) ? this.radiusOuter : this.radiusInner;
            const x = this.cx + Math.cos(angle) * r;
            const y = this.cy + Math.sin(angle) * r;
            verts.push([x, y]);
        }
        return verts;
    }
    getVertices() {
        return this.vertices.map(v => [...v]); // return a copy
    }
}

class Rectangle extends Shape {
    constructor(config, width, height) {
        super(config);
        this.width = width;
        this.height = height;
        this.vertices = this.computeVertices();
    }
    computeVertices() {
        const hw = this.width / 2;
        const hh = this.height / 2;

        // Unrotated rectangle corners relative to center
        return [
            [this.cx - hw, this.cy - hh],
            [this.cx + hw, this.cy - hh],
            [this.cx + hw, this.cy + hh],
            [this.cx - hw, this.cy + hh],
        ];
    }
    getVertices() {
        // Return a shallow copy to avoid mutation
        return this.vertices.map(([x, y]) => [x, y]);
    }
}

class Polygon extends Shape {
    constructor(config, steps = 8, radius = null) {
        super(config);
        this.radius = (radius === null ? this.autoRadius(2.5) : radius);
        this.steps = steps;
        this.vertices = this.computeVertices();
    }
    computeVertices() {
        const verts = [];
        for ( let i = 0; i < this.steps; i++ ) {
            const angle = (i / this.steps) * 2 * Math.PI;
            const x = this.cx + Math.cos(angle) * this.radius;
            const y = this.cy + Math.sin(angle) * this.radius;
            verts.push([x, y]);
        }
        return verts;
    }
    getVertices() {
        return this.vertices.map(v => [...v]);
    }
}
