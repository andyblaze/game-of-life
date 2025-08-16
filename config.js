
const config = {
    framesPerTick : 1, // higher number = less fps
    font: "24px monospace",
    fillColor: "#0f0",
    laneCount: 80,
    maxMainDrops: 30,
    charWidth: 24,
    charHeight: 24,
    speed: {baseRate:0.05, min:10, max:13},
    dropLengths: {min: 5, max:13}, // min / max characters in a drop
    charPool: Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンヴー・" +
              "日月火水木金土年時分秒上下左右中大小入口出口本人力十百千万" + "                "),
    mainSpawnChance: 0.01,
    mainAlphas: {headAlpha: 1, tailMinAlpha: 0.01}
}
export default config;