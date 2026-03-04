export default class PerlinNoise {
    constructor(seed = Math.random()) {
        this.p = new Uint8Array(512);
        this.permutation = new Uint8Array(256);

        // Seeded shuffle (simple deterministic LCG)
        let s = Math.floor(seed * 65536);
        const rand = () => {
            s = (s * 16807) % 2147483647;
            return s / 2147483647;
        };

        for (let i = 0; i < 256; i++) {
            this.permutation[i] = i;
        }

        for (let i = 255; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [this.permutation[i], this.permutation[j]] =
            [this.permutation[j], this.permutation[i]];
        }

        for (let i = 0; i < 512; i++) {
            this.p[i] = this.permutation[i & 255];
        }
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(a, b, t) {
        return a + t * (b - a);
    }

    grad(hash, x, y) {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) === 0 ? u : -u) +
               ((h & 2) === 0 ? v : -v);
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const A = this.p[X] + Y;
        const B = this.p[X + 1] + Y;

        return this.lerp(
            this.lerp(
                this.grad(this.p[A], x, y),
                this.grad(this.p[B], x - 1, y),
                u
            ),
            this.lerp(
                this.grad(this.p[A + 1], x, y - 1),
                this.grad(this.p[B + 1], x - 1, y - 1),
                u
            ),
            v
        );
    }
}
