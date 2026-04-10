export default class SimplexNoise {
    constructor() {
        this.grad3 = [
            [1,1],[-1,1],[1,-1],[-1,-1],
            [1,0],[-1,0],[1,0],[-1,0],
            [0,1],[0,-1],[0,1],[0,-1]
        ];
        this.p = [];
        for (let i = 0; i < 256; i++) this.p[i] = Math.floor(Math.random()*256);
        this.perm = [];
        for (let i = 0; i < 512; i++) this.perm[i] = this.p[i & 255];
    }

    dot(g, x, y) { return g[0]*x + g[1]*y; }

    noise(xin, yin) {
        const F2 = 0.5*(Math.sqrt(3)-1);
        const G2 = (3-Math.sqrt(3))/6;

        let s = (xin+yin)*F2;
        let i = Math.floor(xin+s);
        let j = Math.floor(yin+s);

        let t = (i+j)*G2;
        let X0 = i-t;
        let Y0 = j-t;
        let x0 = xin-X0;
        let y0 = yin-Y0;

        let i1, j1;
        if (x0 > y0) { i1=1; j1=0; }
        else { i1=0; j1=1; }

        let x1 = x0 - i1 + G2;
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1 + 2*G2;
        let y2 = y0 - 1 + 2*G2;

        let ii = i & 255;
        let jj = j & 255;

        let gi0 = this.perm[ii+this.perm[jj]] % 12;
        let gi1 = this.perm[ii+i1+this.perm[jj+j1]] % 12;
        let gi2 = this.perm[ii+1+this.perm[jj+1]] % 12;

        let n0=0, n1=0, n2=0;

        let t0 = 0.5 - x0*x0 - y0*y0;
        if (t0 >= 0) {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
        }

        let t1 = 0.5 - x1*x1 - y1*y1;
        if (t1 >= 0) {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
        }

        let t2 = 0.5 - x2*x2 - y2*y2;
        if (t2 >= 0) {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
        }

        return 70 * (n0 + n1 + n2);
    }
}
