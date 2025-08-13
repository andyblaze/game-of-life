import Drop from "./drop.js";
import Lane from "./lane.js";

export default class Controller {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = config;

        this.charWidth = config.fontSize;
        this.charHeight = config.fontSize;
        this.lanes = [];

        this.spawnChanceNormal = config.spawnChanceNormal; // per frame
        this.spawnChanceGhost = config.spawnChanceGhost;

        // Create lanes
        const laneCount = this.config.laneCount;
        for (let i = 0; i < laneCount; i++) {
            this.lanes.push(new Lane(i));
        }
    }

    randomChars(len) {
        const set = this.config.CHAR_SET;
        return Array.from({ length: len }, () =>
            set[Math.floor(Math.random() * set.length)]
        );
    }

    generateAlphas(length, cfg) {
        const alphas = [];
        const headAlpha = cfg.alphaMax;
        const tailAlpha = cfg.alphaMin;
        const brightCount = Math.floor(
            Math.random() * (cfg.brightCountMax - cfg.brightCountMin + 1)
        ) + cfg.brightCountMin;

        for (let i = length - 1; i >= 0; i--) {
            if (i < brightCount) {
                alphas.push(headAlpha);
            } else {
                const t = (i - brightCount) / (length - brightCount);
                const eased = Math.pow(1 - t, 3); // cubic ease-out
                alphas.push(tailAlpha + eased * (headAlpha - tailAlpha));
            }
        }
        return alphas;
    }

    spawnDrop(isGhost = false) {
        const cfg = isGhost ? this.config.GHOST : this.config.NORMAL;
        const laneIndex = Math.floor(Math.random() * this.lanes.length);
        const lane = this.lanes[laneIndex];

        const length = Math.floor(Math.random() * 15) + 5;
        const chars = this.randomChars(length);
        const alphas = this.generateAlphas(length, cfg);
        const speed = cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin);

        lane.addDrop(new Drop({
            lane: laneIndex,
            y: -length * this.charHeight, // start above screen
            speed,
            chars,
            alphas,
            isGhost
        }));
    }

    update(delta) {
        for (let lane of this.lanes) {
            // Move drops
            for (let drop of lane.drops) {
                drop.update(delta);
            }
            // Remove offscreen drops
            lane.removeOffScreen(this.canvas.height, this.charHeight);

            // Spawn new drops randomly
            if (Math.random() < this.spawnChanceNormal) {
                this.spawnDrop(false);
            }
            if (Math.random() < this.spawnChanceGhost) {
                this.spawnDrop(true);
            }
        }
    }

    draw(drawFn) {
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let lane of this.lanes) {
            for (let drop of lane.drops) {
                drawFn(drop, lane.index * this.charWidth, this.charHeight);
            }
        }
    }
}