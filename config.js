
const config = {
    framesPerTick : 1, // higher number = less fps
    font: "24px monospace",
    fillColor: "#0f0",
    laneCount: 80,
    maxMainDrops: 20,
    charWidth: 24,
    charHeight: 24,
    main: {
        speed: {baseRate:0.05, min:7, max:10},
        dropLengths: {min: 5, max:13}, // min / max characters in a drop
        alphaRange: {headAlpha: 1, tailAlpha: 0.01},
        charHeight:24,
        isGhost: false,
        charPool: Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンヴー・" +
                    "日月火水木金土年時分秒上下左右中大小入口出口本人力十百千万" + "                ")
    },
    ghost: {
        speed: {baseRate:0.05, min:4, max:9},
        dropLengths: {min: 4, max:13}, // min / max characters in a drop
        alphaRange: {headAlpha: 0.4, tailAlpha: 0.01},
        charHeight:24,
        isGhost: true,
        charPool: Array.from(",.`'・\"+*^≠±×÷∑∆π√─┐└┘┌•◦●○◉◎" + "        ")
                    //"日月火水木金土年時分秒上下左右中大小入口出口本人力十百千万" + "                ")
    },
    //charPool: Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンヴー・" +
    //          "日月火水木金土年時分秒上下左右中大小入口出口本人力十百千万" + "                "),
    mainSpawnChance: 0.01,    
    ghostSpawnChance: 0.01,
    ghostsPerLane: 3    
}
export default config;