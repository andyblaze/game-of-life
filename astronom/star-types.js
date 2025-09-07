
export class TrinaryStar {
    constructor(cfg) {
        // system-level
        this.systemRadius = cfg.systemRadius;
        this.systemAngle  = cfg.systemAngle;
        this.size         = cfg.size;
        this.colors       = cfg.colors;        // array of 3 colors

        // local orbit params
        this.localRadii      = cfg.localRadii;      // [binaryRadius, thirdStarRadius]
        this.localAngles     = cfg.localAngles;     // [binaryPhase, thirdStarPhase]
        this.localSpeeds     = cfg.localSpeeds;     // [binarySpeed, thirdStarSpeed]
        this.eccentricities  = cfg.eccentricities || [0, 0]; // optional push/pull
        this.pulsePeriods    = cfg.pulsePeriods || [200, 200]; // optional
        this.pulsePhases     = [Math.random()*2*Math.PI, Math.random()*2*Math.PI]; // random start
        this.phase = Math.random() * 2 * Math.PI; // random start so multiple trinaries aren't synchronized
        this.phaseSpeed = Math.PI / 120;          // controls speed of dim/bright cycle (~2 sec at 60fps)
    }
    
    pulseOffset(n) {
        return Math.sin((this.localAngles[n]/this.pulsePeriods[n])*2*Math.PI + this.pulsePhases[n]);
    }
    getRadius(n, pulseBinary) {
        return this.localRadii[n] * (1 - this.eccentricities[n]*pulseBinary);
    }
    setAngle(n) {
        this.localAngles[n] += this.localSpeeds[n];
    }
    getCenter(axis, multiplier) {
        return axis + this.systemRadius * multiplier;
    }
    update(ctx, centerX, centerY, skySpeed) {
        // advance system rotation around Polaris
        this.systemAngle += skySpeed;

        // compute pulse offsets for eccentricity
        const pulseBinary = this.pulseOffset(0);
        const pulseThird  = this.pulseOffset(1);

        const radiusBinary = this.getRadius(0, pulseBinary);
        const radiusThird  = this.getRadius(1, pulseThird);

        // advance local angles
        this.setAngle(0);  // binary orbit
        this.setAngle(1);  // third star orbit

        // system center
        const cx = this.getCenter(centerX, Math.cos(this.systemAngle));
        const cy = this.getCenter(centerY, Math.sin(this.systemAngle));

        // binary stars positions
        const x1 = cx + radiusBinary * Math.cos(this.localAngles[0]);
        const y1 = cy + radiusBinary * Math.sin(this.localAngles[0]);

        const x2 = cx - radiusBinary * Math.cos(this.localAngles[0]);
        const y2 = cy - radiusBinary * Math.sin(this.localAngles[0]);

        // third star position
        const x3 = cx + radiusThird * Math.cos(this.localAngles[1]);
        const y3 = cy + radiusThird * Math.sin(this.localAngles[1]);

        // draw the three stars
        ctx.fillStyle = this.colors[0];
        ctx.beginPath(); ctx.arc(x1, y1, this.size, 0, Math.PI*2); ctx.fill();

        ctx.fillStyle = this.colors[1];
        ctx.beginPath(); ctx.arc(x2, y2, this.size, 0, Math.PI*2); ctx.fill();
        // advance phase
        this.phase += this.phaseSpeed;
        const c = [...this.colors[2]]; // copy of [r,g,b,a]
        c[3] = 0.75 + 0.25 * Math.sin(this.phase);
        ctx.fillStyle = "rgba(" + c.join(",") + ")";
        ctx.beginPath(); ctx.arc(x3, y3, this.size, 0, Math.PI*2); ctx.fill();
    }
}

export class BinaryStar {
    constructor(cfg) {
        this.systemRadius = cfg.systemRadius;
        this.systemAngle  = cfg.systemAngle;
        this.localRadius  = cfg.localRadius;
        this.localAngle   = cfg.localAngle;
        this.localSpeed   = cfg.localSpeed;
        this.size         = cfg.size;
        this.color        = cfg.color;

        // internal eccentricity/pulse parameters
        this.eccentricity = 0.85;     // max deviation from normal radius
        this.pulsePeriod  = 120;      // frames per full pulse cycle
        this.pulsePhase   = Math.random() * Math.PI * 2; // start offset
    }

    update(ctx, centerX, centerY, skySpeed) {
        // advance the binary system around Polaris
        this.systemAngle += skySpeed;

        // pulse offset
        const pulse = Math.sin((this.localAngle / this.pulsePeriod) * 2 * Math.PI + this.pulsePhase);
        const radius = this.localRadius * (1 - this.eccentricity * pulse);
        const speed  = this.localSpeed * (1 + this.eccentricity * pulse);

        // advance the local orbit of the two stars
        this.localAngle += speed;

        // compute system center
        const cx = centerX + this.systemRadius * Math.cos(this.systemAngle);
        const cy = centerY + this.systemRadius * Math.sin(this.systemAngle);

        // positions of the two stars in the binary
        const x1 = cx + radius * Math.cos(this.localAngle);
        const y1 = cy + radius * Math.sin(this.localAngle);

        const x2 = cx - radius * Math.cos(this.localAngle);
        const y2 = cy - radius * Math.sin(this.localAngle);

        // draw the two stars
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(x1, y1, this.size, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x2, y2, this.size, 0, Math.PI*2); ctx.fill();
    }
}