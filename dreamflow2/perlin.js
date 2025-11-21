// Perlin.js — Improved Perlin Noise (Ken Perlin)
// Supports 1D, 2D, and 3D noise

export default class Perlin {
    constructor(seed = Math.random() * 65536) {
        this.perm = new Uint8Array(512);
        this.gradP = new Float32Array(512 * 3);

        this.seed(seed);
    }

    seed(seed) {
        if (seed > 0 && seed < 1) {
            seed *= 65536;
        }

        seed = Math.floor(seed);
        if (seed < 256) seed |= seed << 8;

        const p = new Uint8Array(256);

        for (let i = 0; i < 256; i++) {
            let v;
            if (i & 1) {
                v = seed ^ (i & 255);
            } else {
                v = seed ^ ((i << 1) & 255);
            }
            p[i] = v;
        }

        for (let i = 0; i < 256; i++) {
            const n = p[i];
            this.perm[i] = this.perm[i + 256] = n;
            this.gradP[i * 3]     = this.gradP[(i + 256) * 3]     = this.gradX(n);
            this.gradP[i * 3 + 1] = this.gradP[(i + 256) * 3 + 1] = this.gradY(n);
            this.gradP[i * 3 + 2] = this.gradP[(i + 256) * 3 + 2] = this.gradZ(n);
        }
    }

    gradX(hash) { return (hash & 15) < 8 ? 1 : -1; }
    gradY(hash) { return (hash & 7) < 4 ? 1 : -1; }
    gradZ(hash) { return (hash & 3) < 2 ? 1 : -1; }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(a, b, t) {
        return a + t * (b - a);
    }

    // ------------------------------------------------------------------
    // 2D Perlin Noise
    // ------------------------------------------------------------------
    noise(x, y = 0, z = 0) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);

        const fx = this.fade(x);
        const fy = this.fade(y);
        const fz = this.fade(z);

        const A  = this.perm[X] + Y;
        const AA = this.perm[A] + Z;
        const AB = this.perm[A + 1] + Z;

        const B  = this.perm[X + 1] + Y;
        const BA = this.perm[B] + Z;
        const BB = this.perm[B + 1] + Z;

        return this.lerp(
            this.lerp(
                this.lerp(this.grad(AA, x, y, z),
                          this.grad(BA, x - 1, y, z), fx),
                this.lerp(this.grad(AB, x, y - 1, z),
                          this.grad(BB, x - 1, y - 1, z), fx),
                fy
            ),
            this.lerp(
                this.lerp(this.grad(AA + 1, x, y, z - 1),
                          this.grad(BA + 1, x - 1, y, z - 1), fx),
                this.lerp(this.grad(AB + 1, x, y - 1, z - 1),
                          this.grad(BB + 1, x - 1, y - 1, z - 1), fx),
                fy
            ),
            fz
        );
    }

    grad(hash, x, y, z) {
        const g = hash * 3;
        return this.gradP[g] * x + this.gradP[g + 1] * y + this.gradP[g + 2] * z;
    }
}
