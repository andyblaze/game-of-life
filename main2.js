import Controller from "./controller.js";
import MatrixView from "./renderer.js";

const config = {
    fontSize: 24,
    fontFamily: 'monospace',
    CHAR_SET: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンヴー・         '.split(''),
    laneCount:80,
    spawnChanceNormal: 0.0025, // per frame
    spawnChanceGhost: 0.02,

    NORMAL: {
        color: [0, 255, 0], // bright green
        speedMin: 1,
        speedMax: 3,
        alphaMax: 1,
        alphaMin: 0.05,
        brightCountMin: 1,
        brightCountMax: 3,
        offsetX: 0,
        offsetY: 0
    },

    GHOST: {
        color: [0, 100, 0], // dim green
        speedMin: 0.5,
        speedMax: 1,
        alphaMax: 0.4,
        alphaMin: 0.01,
        brightCountMin: 0,
        brightCountMax: 1,
        offsetX: 0,
        offsetY: 0
    }
};

function resizeCanvas(c, v) {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    v.resize(c.width, c.height);
    console.log("rc", c.width, c.height);
}

window.addEventListener('resize', () => {
    resizeCanvas(canvas, view);
});

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('matrix');

    const controller = new Controller(canvas, config);
    const view = new MatrixView(config, canvas.width, canvas.height);
    resizeCanvas(canvas, view);

    let lastTime = performance.now();
    function loop(timestamp) {
        const delta = (timestamp - lastTime) / 16.67;
        controller.update(delta);
        view.clear();
        controller.draw((drop, x, charHeight) => {
            view.drawDrop(drop, x, charHeight);
        });
        view.blitToScreen(canvas.getContext('2d'));
        lastTime = timestamp;
        requestAnimationFrame(loop);
    }

    loop();
});