export function getCanvas() {
    return document.getElementById("onscreen");
}
export function getCtx() {
    return getCanvas().getContext("2d");
}

// ---------- Simulation parameters (edit these) ----------
export const config = {
    M1: 1.0,             // mass of star A (donor)
    M2: 2.4,             // mass of star B (accretor)
    separation: 260,     // separation between star centers in pixels
    desiredPeriod: 28.0,  // desired orbital period in seconds (used to pick G)
    softening: 1.0,      // gravitational softening in pixels (prevents singularity)
    visualScale: 4.0,     // world -> screen scale (pixels per world unit)
    eccentricity: 0.4,  // 0 = circle, 0.4 = noticeable ellipse, <1
    activeParticleCount: 1500,
    get canvasW() { return getCanvas().width; },
    get canvasH() { return getCanvas().height; },
    DPR: window.devicePixelRatio || 1
};
