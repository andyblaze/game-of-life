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
            numLights:1,
        },
        types: [
            { 
                color:[0, 255, 100], name: "Type1"
            },
            {   
                color:[0, 100, 255], name: "Type2"
            },
            {   
                color:[0, 255, 100], name: "Type3"
            }
        ]
    }
}