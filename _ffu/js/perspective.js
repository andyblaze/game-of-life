// ----------------------------
// SIMPLE PERSPECTIVE PROJECTION
// ----------------------------

export default class Perspective {
    project(star, ship, cfg) {
        const dz = star.z - ship.z;
        const scale = 600 / dz;

        return {
            x: cfg.halfWidth + (star.x - ship.x) * scale,
            y: cfg.halfHeight + (star.y - ship.y) * scale,
            scale,
            dz
        };
    }
}