import Controller from "./controller.js";
import MatrixView from "./renderer.js";

const config = {
    fontSize: 24,
    fontFamily: 'monospace',
    CHAR_SET: 'ｱｲｳｴｵｶｷｸｹｺ0123456789'.split(''),

    NORMAL: {
        color: [0, 255, 0], // bright green
        speedMin: 2,
        speedMax: 5,
        alphaMax: 1,
        alphaMin: 0.05,
        brightCountMin: 1,
        brightCountMax: 3,
        offsetX: 0,
        offsetY: 0
    },

    GHOST: {
        color: [0, 100, 0], // dim green
        speedMin: 1,
        speedMax: 3,
        alphaMax: 0.4,
        alphaMin: 0.01,
        brightCountMin: 0,
        brightCountMax: 1,
        offsetX: 0,
        offsetY: 0
    }
};

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('matrix');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const controller = new Controller(canvas, config);
    const view = new MatrixView(config);

    let lastTime = performance.now();
    function loop(timestamp) {
        const delta = (timestamp - lastTime) / 16.67;
        controller.update(delta);
        controller.draw((ctx, drop, x, charHeight) => {
            view.drawDrop(ctx, drop, x, charHeight);
        });
        lastTime = timestamp;
        requestAnimationFrame(loop);
    }

    loop();
});