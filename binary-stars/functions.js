import { getCanvas, getCtx } from "./config.js";

export function resize() {
    const canvas = getCanvas();
    const ctx = getCtx();
    const DPR = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    // draw in CSS pixels (transform to account for DPR)
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

export function Point(a, b) {
    return { "x": a, "y": b };
}