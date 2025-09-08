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
            numItems:1,
            skySpeed: 0.00007, // all stars rotate at this slow rate
            // ------------------ Stars ------------------
            totalStars: 400,
            BASELINE_SCALE: 300,
            starColors: [
              // your original blue set
              "rgba(14,186,225,1)",  // #0EBAE1
              "rgba(25,195,240,1)",  // #19C3F0
              "rgba(36,174,224,1)",  // #24AEE0
              "rgba(29,161,210,1)",  // #1DA1D2
              "rgba(60,198,232,1)",  // #3CC6E8
              "rgba(74,181,217,1)",  // #4AB5D9
              "rgba(47,159,196,1)",  // #2F9FC4
              "rgba(85,208,238,1)",  // #55D0EE
              "rgba(56,184,226,1)",  // #38B8E2
              "rgba(27,143,184,1)"  // #1B8FB8
            ],
            constellationColors: [
              // added realistic star tones
              "rgba(255,255,255,1)",  // pure white
              "rgba(245,245,230,1)",  // warm white
              "rgba(255,244,214,1)",  // pale yellow (like Polaris)
              "rgba(255,214,170,1)",  // soft golden
              "rgba(255,200,150,1)",  // orange tint (like Arcturus)
              "rgba(200,220,255,1)"   // very pale blue-white (like Sirius)
            ],
            // ------------------ Constellations (polar coordinates) ------------------
            ursaMinor: [
                {x:0,y:0},{x:-10,y:-40},{x:10,y:-60},{x:25,y:-50},
                {x:35,y:-30},{x:15,y:-20},{x:0,y:-10}
            ],
            ursaMajor: [
                {x:-50,y:50},{x:-30,y:30},{x:-10,y:40},{x:10,y:30},
                {x:30,y:40},{x:50,y:20},{x:40,y:0}
            ],
            // Orion (compact & stylized)
            orion: [
                {x:100,y:60},   // Betelgeuse (top-left shoulder)
                {x:140,y:100},  // belt left
                {x:160,y:110},  // belt center
                {x:180,y:100},  // belt right
                {x:220,y:60},   // Bellatrix (top-right shoulder)
                {x:140,y:150},  // Saiph (lower left leg)
                {x:180,y:150}   // Rigel (lower right leg)
            ],
            cassiopeia: [
                {x:-150, y:-50}, {x:-120, y:-80}, {x:-90, y:-50},
                {x:-60, y:-80}, {x:-30, y:-50}
            ],
            pleiades: [
                {x:180, y:-150}, {x:190, y:-140}, {x:200, y:-145},
                {x:210, y:-135}, {x:220, y:-140}, {x:215, y:-150}, {x:205, y:-155}
            ],
            binaries: [
                {
                    systemRadius: 200,       // distance from Polaris
                    systemAngle: Math.random() * Math.PI * 2,  // starting sky angle
                    localRadius: 8,         // half the distance between the two stars
                    localAngle: 0,           // phase of the orbit
                    localSpeed: 0.03,        // how fast they orbit each other
                    size: 1.5,                 // star radius for drawing
                    color: "rgba(255,255,200,1)" // pale yellow-white, like real binaries
                }
            ],
            trinaries: [
              {
                systemRadius: 300,           // distance from Polaris
                systemAngle: Math.random() * Math.PI*2, // starting global angle
                size: 1.5,                     // star radius for drawing
                colors: [                     // array for the three stars
                  [255,230,200,1],
                  [255,250,180,1],
                  [255,200,180,1]
                ],
                localRadii: [20, 30],        // first = radius of binary, second = radius of third star
                localAngles: [0, 0],         // starting phase for local orbits
                localSpeeds: [0.02, 0.015],  // speed for each local orbit
                eccentricities: [0.2,0.1],   // optional for push/pull effect
                pulsePeriods: [200, 300]     // optional, frames per pulse cycle
              }
            ]
        },
        types: [
            { 
                name: "Type1", color:[0,0,0],
                pos: { x: 228, y: 75 },
                patchRadius: 80,      // how big the dusty patch looks
                dustColor: "rgba(200,180,255,0.2)", 
                dustDensity: 0.4,    // dust speck chance per frame
                buildTime: 10000,     // ms to fully “charge”
                birthChance: 0.1,     // probability (when charged) of birthing a star per second
                launchSpeed: 4.0,     // px/frame initial speed of newborn star
                launchArc: 0.2,       // radians variance in launch direction
                fadeTime: 15000,      // ms dust fades after a birth
                starSize: [1, 2],     // newborn size range
                starColors: [
                  [255,230,200,1],
                  [200,220,255,1],
                  [255,255,180,1]
                ]
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