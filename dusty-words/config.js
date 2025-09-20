import {scaleX, scaleY } from "./functions.js";

const screenW = window.innerWidth;
const screenH = window.innerHeight;

const CONFIG = {
    SCREEN_W: screenW,
    SCREEN_H: screenH,
    SPAWN_X: screenW / 2,   // center of fountain
    SPAWN_WIDTH: scaleX(400),             // how wide the base is
    SPAWN_HEIGHT: scaleY(100), // how tall the vertical band is at the bottom
    CONE_ANGLE: 90, // spread around vertical
    INIT_SPEED: 1.5,
    NUM_PARTICLES: 1500,
    WORD_PARTICLE_COUNT: 500,
    FORM_STEPS: 480,
    HOLD_STEPS: 240,
    DISPERSAL_STEPS: 300,
    FREE_TIME: 600,
    WORDS: ["MAGIC", "LIVING", "DUST", "FIRE", "ASH", "SMOKE", "EMBERS", "FLAMES", "SPARKS", "HEAT", "BURN", "FUEL"],
    FONT: "bold 120px serif",
    FORMATION_SPEED: 0.008,
    NOISE_SPEED: 0.3,
    DUST_DIRECTION: 270,
    SPEED_FACTOR: {
        MIN: 0.7,
        MAX: 2.7
    },
    NOISE_SCALE: 0.002,
    WORD_AREA: {           // configurable placement zone
        MIN_X: scaleX(150),
        MAX_X: scaleX(screenW - 150),
        MIN_Y: scaleY(150),
        MAX_Y: scaleY(screenH - 150)
    },
    PARTICLE_COLORS: [
        "hsla(16, 100%, 54%, 1)",   // #ff4500 orange-red (flame core)
        "hsla(9, 100%, 64%, 1)",    // #ff6347 tomato orange
        "hsla(39, 100%, 50%, 1)",   // #ffa500 classic orange
        "hsla(51, 100%, 50%, 1)",   // #ffd700 golden yellow
        "hsla(60, 100%, 80%, 1)",   // #ffff99 pale yellow spark
        "hsla(0, 100%, 50%, 1)",    // #ff0000 deep red ember
        "hsla(0, 100%, 25%, 1)",    // #800000 smoldering dark red
        "hsla(0, 0%, 27%, 1)"       // #444444 occasional ash/ember fade
    ],
    PARTICLE_SHAPES: ["circle", "rect", "triangle", "line"],
    EMBER: {
        POOL_SIZE: 30,
        SPAWN_X: screenW / 2,        // center of fire
        SPAWN_Y: screenH - scaleY(200),      // approximate fire top
        SPAWN_WIDTH: 60,                   // horizontal variation
        SPAWN_HEIGHT: 20,                  // vertical variation
        SPAWN_CHANCE: 0.1,
        MIN_SPEED: 2,                      // initial velocity min
        MAX_SPEED: 5,                      // initial velocity max
        MIN_ANGLE: -30,                    // degrees from vertical
        MAX_ANGLE: 30,                     // degrees from vertical
        LIFETIME: 4000,                    // milliseconds
            COLORS: [
            {h:16, s:"100%", l:"54%", a:1},          // bright yellow
            {h:30, s:"100%", l:"50%", a:1},          // orange
            {h:0, s:"100%", l:"40%", a:1}            // red ember
        ],
        TRAIL_LENGTH: 8,                   // number of previous positions to keep for trail
        GRAVITY: 0.02,                     // optional downward pull
        WIND: 0.02                          // optional horizontal drift
    },
    SHIMMER: {
        regions: [{x: scaleX(970), y: scaleY(600)},{x: scaleX(880), y: scaleY(690)}],
        width: scaleX(50),
        height: scaleY(120),
        colors: ["rgba(255,100,0,0.05)", "rgba(255,200,0,0.2)"],
        shadowColor: "rgba(255,80,0,0.2)",
        shadowBlur: 20,
        flameWidth: 15,
        amplitude: 10,
        frequency: 0.25,
        speed: 0.0014
    },
    GROUND_FLICKER: {
        SCREEN_W: screenW,
        SCREEN_H: screenH,
        enabled: true,          // turn effect on/off
        marginX: scaleX(100),           // left/right margin in pixels
        height: scaleY(550),            // height of flicker region from top
        numCells: 15,           // number of Voronoi-like cells
        baseLightness: 20,      // base darkness of the cells (0–100)
        flickerAmplitude: 20,    // how much lightness oscillates (+/-)
        flickerSpeed: 0.002,    // speed of flicker
        jitter: 5,              // maximum pixel jitter for cell centers
        blendMode: "overlay"     // ctx.globalCompositeOperation
    }
};

export default CONFIG;