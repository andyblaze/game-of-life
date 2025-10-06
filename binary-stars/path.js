export default function createBridgePath(donor, accretor) {
    const start = { x: donor.pos.x, y: donor.pos.y };
    
    // Vector donor → accretor center
    const dx = accretor.pos.x - donor.pos.x;
    const dy = accretor.pos.y - donor.pos.y;
    const len = Math.hypot(dx, dy) || 1;

    // Perpendicular vector → points “up” from donor → accretor line
    const perpX = dy / len;
    const perpY = -dx / len;

    // North pole of accretor (endpoint of bridge just outside radius)
    const northPole = {
        x: accretor.pos.x + perpX * accretor.radius * 0.75,
        y: accretor.pos.y + perpY * accretor.radius * 0.75
    };

    // Midpoint for curvature (slightly offset from straight line)
    const mid = {
        x: (start.x + northPole.x) / 2,
        y: (start.y + northPole.y) / 2 - 30  // adjust for curvature; can add noise later
    };

    // Return a function mapping t ∈ [0,1] → position along bridge
    return function(t) {
        const invT = 1 - t;
        return {
            x: invT * invT * start.x + 2 * invT * t * mid.x + t * t * northPole.x,
            y: invT * invT * start.y + 2 * invT * t * mid.y + t * t * northPole.y
        };
    };
}
