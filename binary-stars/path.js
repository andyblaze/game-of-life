export default function createBridgePath(donor, accretor) {
    const start = { x: donor.pos.x, y: donor.pos.y };
    const end = { x: accretor.pos.x, y: accretor.pos.y };

    // Control point slightly offset toward the accretor to give a curve
    const mid = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2 - 20  // adjust vertical offset for curvature  !!!!!! PERLIN NOISE FOR THE 20 ?
    };

    // Return a function that maps t -> [0,1] to a point on the quadratic Bezier curve
    return function(t) {
        const invT = 1 - t;
        return {
            x: invT * invT * start.x + 2 * invT * t * mid.x + t * t * end.x,
            y: invT * invT * start.y + 2 * invT * t * mid.y + t * t * end.y
        };
    };
}