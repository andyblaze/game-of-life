// Simple 2D Perlin Noise (small variant)
// Reliable 2D Perlin noise
const Perlin2D = {
    perm: [],
    init() {
        const p = [];
        for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);

        this.perm = new Array(512);
        for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
    },

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    },

    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    grad(hash, x, y) {
        switch (hash & 3) {
            case 0: return  x + y;
            case 1: return -x + y;
            case 2: return  x - y;
            case 3: return -x - y;
        }
    },

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const aa = this.perm[X + this.perm[Y]];
        const ab = this.perm[X + this.perm[Y + 1]];
        const ba = this.perm[X + 1 + this.perm[Y]];
        const bb = this.perm[X + 1 + this.perm[Y + 1]];

        return this.lerp(
            this.lerp(this.grad(aa, x, y),     this.grad(ba, x - 1, y),     u),
            this.lerp(this.grad(ab, x, y - 1), this.grad(bb, x - 1, y - 1), u),
            v
        );
    }
};

Perlin2D.init();

export function curlNoise(x, y) {

    const scale = 0.000015;  // <<< tweak this for speed/smoothness
    const eps   = 0.001;   // <<< derivative step

    const nx = x * scale;
    const ny = y * scale;

    const n1 = Perlin2D.noise(nx, ny + eps);
    const n2 = Perlin2D.noise(nx, ny - eps);
    const n3 = Perlin2D.noise(nx + eps, ny);
    const n4 = Perlin2D.noise(nx - eps, ny);

    return {
        x: (n1 - n2) * 0.5,
        y: (n4 - n3) * 0.5
    };
}

