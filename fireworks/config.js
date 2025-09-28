import {scaleX, scaleY, randomFrom } from "./functions.js";

const screenW = window.innerWidth;
const screenH = window.innerHeight;

export const colors = [
    // Cyan / Teal
    [
      { h:180, s:"100%", l:"55%", a:1 },
      { h:175, s:"100%", l:"50%", a:1 },
      { h:185, s:"95%",  l:"60%", a:1 },
      { h:190, s:"100%", l:"58%", a:1 },
      { h:170, s:"90%",  l:"52%", a:1 }
    ],
    // Purple / Magenta
    [
      { h:270, s:"100%", l:"55%", a:1 },
      { h:275, s:"100%", l:"50%", a:1 },
      { h:265, s:"95%",  l:"60%", a:1 },
      { h:280, s:"100%", l:"58%", a:1 },
      { h:260, s:"90%",  l:"52%", a:1 }
    ],
    // Pink
    [
      { h:330, s:"100%", l:"55%", a:1 },
      { h:340, s:"100%", l:"50%", a:1 },
      { h:320, s:"95%",  l:"60%", a:1 },
      { h:335, s:"100%", l:"58%", a:1 },
      { h:310, s:"90%",  l:"52%", a:1 }
    ],
    // White / sparkle
    [
      { h:0, s:"0%", l:"100%", a:1 },
      { h:0, s:"0%", l:"95%",  a:1 },
      { h:0, s:"0%", l:"90%",  a:1 },
      { h:0, s:"0%", l:"85%",  a:1 },
      { h:0, s:"0%", l:"80%",  a:1 }
    ],
    [ // fiery
        { h:16, s:"100%", l:"54%", a:1 },   
        { h:9, s:"100%", l:"64%", a:1 },    
        { h:39, s:"100%", l:"50%", a:1 },   
        { h:51, s:"100%", l:"50%", a:1 },   
        { h:60, s:"100%", l:"80%", a:1 },  
        { h:0, s:"100%", l:"50%", a:1 },    
        { h:0, s:"100%", l:"25%", a:1 },   
        { h:0, s:"0%", l:"27%", a:1 }      
    ], 
    // Greens
    [
      { h:120, s:"100%", l:"55%", a:1 },  // base bright green
      { h:115, s:"100%", l:"50%", a:1 },  // slightly warmer green
      { h:125, s:"100%", l:"60%", a:1 },  // slightly cooler, lighter
      { h:130, s:"90%",  l:"50%", a:1 },  // a touch desaturated
      { h:110, s:"100%", l:"58%", a:1 },  // bold lime-ish
      { h:135, s:"95%",  l:"55%", a:1 }   // teal-leaning variation
    ],
    // Reds
        [
      { h:0,   s:"100%", l:"55%", a:1 },
      { h:5,   s:"100%", l:"50%", a:1 },
      { h:350, s:"95%",  l:"60%", a:1 },
      { h:10,  s:"100%", l:"58%", a:1 },
      { h:355, s:"90%",  l:"52%", a:1 }
    ], 
    // Blues
        [
      { h:210, s:"100%", l:"55%", a:1 },
      { h:220, s:"100%", l:"50%", a:1 },
      { h:200, s:"95%",  l:"60%", a:1 },
      { h:230, s:"100%", l:"58%", a:1 },
      { h:205, s:"90%",  l:"52%", a:1 }
    ], 
    // Golds (yellow/orange)
        [
      { h:45,  s:"100%", l:"55%", a:1 },
      { h:50,  s:"100%", l:"50%", a:1 },
      { h:40,  s:"95%",  l:"60%", a:1 },
      { h:35,  s:"100%", l:"58%", a:1 },
      { h:55,  s:"90%",  l:"52%", a:1 }
    ]
];

const flatColors = colors.flat();

export function superRandomColors(n) {
    if (n === 1) {
        return flatColors[Math.floor(Math.random() * flatColors.length)];
    }
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = flatColors[Math.floor(Math.random() * flatColors.length)];
    }
    return result;
}


//export colors;