import { getCanvas, getCtx } from "./config.js";

// ---------- Color interpolation utilities ----------

// Clamp any value between 0–1
function clamp01(v) {
    return Math.max(0, Math.min(1, v));
}

// Linear interpolation
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Interpolate between two HSLA color objects
export function lerpColor(c1, c2, t) {
    t = clamp01(t);

    // handle hue wraparound properly (e.g. 350° → 10° should move through red, not around the wheel)
    let h1 = c1.h, h2 = c2.h;
    let dh = h2 - h1;
    if (Math.abs(dh) > 180) {
        if (h2 > h1) h1 += 360;
        else h2 += 360;
    }

    const h = (lerp(h1, h2, t) + 360) % 360;
    const s = lerp(c1.s, c2.s, t);
    const l = lerp(c1.l, c2.l, t);
    const a = lerp(c1.a, c2.a, t);

    return { h, s, l, a };
}

export function hslaStr(c) {
    return `hsla(${c.h.toFixed(1)}, ${c.s}%, ${c.l}%, ${c.a})`;
}

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