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
            numSites:80,
            noiseSeedRange: 1000, // tweak this if you want slower/faster initial offsets
              baseHue: 20,      // red/orange
              hueRange: 60, 
              lightRange: 60,
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
              base: 0,       // start red
              range: 360,    // full spectrum spin
              light: 40,    // cells pulse vividly
              speed: 0.001
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