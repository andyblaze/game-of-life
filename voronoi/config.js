import { mt_rand } from "./functions.js";

export default class Config {
    static item(key) {
        return Config.data[key];
    }
    static global(key="") {
        return (key === "" ? Config.data.global : Config.data.global[key]);
    }
    static getRandom() {
        const idx = mt_rand(0, this.data.types.length - 1);
        return this.data.types[idx];
    }
    static data = {
        global: {
            width: window.innerWidth,   // canvas width
            height: window.innerHeight, // canvas height
            framesPerTick: 1,          // update frequency (higher = slower updates, lower CPU)
            numSites:20,
            noiseSeedRange: 1000, // tweak this if you want slower/faster initial offsets
            
            lava:{ 
              baseHue: 20,      // red/orange
              hueRange: 60,     // swings into yellow → crimson
              lightRange: 35 },
            cool: {
              baseHue: 200,     // cyan/blue
              hueRange: 60,     // swings from teal → violet
              lightRange: 25    // gentle shimmer in brightness
            },
            psych: {
              baseHue: 0,       // start red
              hueRange: 360,    // full spectrum spin
              lightRange: 40    // cells pulse vividly
            },
            forest: {
              baseHue: 120,     // green
              hueRange: 40,     // swings from yellow-green → blue-green
              lightRange: 20    // subtle breathing
            },
            glass: {
              baseHue: 180,     // aqua
              hueRange: 20,     // almost monochrome
              lightRange: 15    // very soft shimmer
            },
            facet: {
              baseHue: 200,    // starting color (blue-ish)
              hueRange: 120,   // how much hue swings
              lightRange: 40,  // brightness swing
              sat: 70          // saturation
            },
            ocean: {
                base: 190,      // start at cyan
                range: 30,      
                speed: 0.002
            }
        },
        boids: {
            numBoids: 20,             // number of boids to simulate
            // --- perception ---
            neighborRadius: 1150,        // how far a boid "sees" others
                                      // bigger → flock acts more coherently
                                      // smaller → more local chaos & splintering
            separationDistance: 44,     // minimum comfortable distance
                                      // if neighbors are closer than this, boid steers away
            // --- weights / strengths ---
            separationStrength: 0.9,   // how strongly a boid avoids crowding
                                      // bigger → flock looks looser, more "pushy"
                                      // smaller → boids overlap more
            alignmentStrength: 0.00001,     // how strongly a boid matches neighbor direction
                                      // bigger → flock aligns quickly, straighter flight
                                      // smaller → flock looks messy / scattered
            cohesionStrength: 0.000001,     // how strongly a boid moves toward neighbor center
                                      // bigger → flock clumps tighter, denser formations
                                      // smaller → flock drifts apart
            // --- motion limits ---
            maxSpeed: 0.8,              // maximum boid speed
                                      // bigger → flock moves faster, more energetic
                                      // smaller → slower, gentler motion
            maxForce: 0.000001,               // maximum steering adjustment per frame
                                      // bigger → boids can make sharp, agile turns
                                      // smaller → smooth but less responsive turns
            // --- environment ---
            noiseStrength: 0.002,   // how strong the "gusts of wind" are
                                // bigger → more chaotic ripples
                                // smaller → subtle, natural undulations  
            driftSpeed: 0.00002, // How much far away boids drift around
            edgeNudgeStrength: 0.0002, // how much boids will avoid edges - bigger number is more avoidance
            edgeNudgeChance: 1.1, // Random chance to apply edge nudge
            color: {h:10, s:100, l:25, a:0.09}
        },
        types: [
            { 
                color:[0, 255, 100], name: "Type1"
            },
            {   
                color:[0, 255, 100], name: "Type2"
            },
            {   
                color:[0,255,  100], name: "Type3"
            }
        ]
    }
}