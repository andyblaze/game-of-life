//const canvas = document.getElementById('sky');
//const ctx = canvas.getContext('2d');
import { randomFrom } from "./functions.js";

class TrinaryStar {
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

class BinaryStar {
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

export default class Stars {
    constructor(cfg) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.stars = [];
        this.binaries = [];
        this.trinaries = [];
        this.scale = Math.min(this.width, this.height) / cfg.BASELINE_SCALE;

        // ------------------ Rotation Speed ------------------
        this.skySpeed = cfg.skySpeed;

        // ------------------ Stars ------------------
        this.addBinaries(cfg);
        this.addTrinaries(cfg);
        this.addConstellations(cfg);
        this.addStars(cfg);
    }
    addBinaries(cfg) {
        cfg.binaries.forEach(b=> {
            this.binaries.push(new BinaryStar(b));
        });        
    }
    addTrinaries(cfg) {
        cfg.trinaries.forEach(t=> {
            this.trinaries.push(new TrinaryStar(t));
        });        
    }
    addConstellations(cfg) {
        const constellationPoints = [...cfg.ursaMinor, ...cfg.ursaMajor, ...cfg.orion, ...cfg.cassiopeia, ...cfg.pleiades];
        constellationPoints.forEach(c => {
            const x = c.x * this.scale;
            const y = c.y * this.scale;
            const radius = Math.sqrt(x*x + y*y);
            const angle = Math.atan2(y, x);
            this.stars.push({
                radius: radius,
                angle: angle,
                size: Math.round(1.6 + Math.random()*0.5), // slightly bigger
                color: randomFrom(cfg.constellationColors)
            });
        });
    }
    addStars(cfg) {
        while(this.stars.length < cfg.totalStars){
            const radius = Math.random()*Math.sqrt(this.centerX*this.centerX + this.centerY*this.centerY);
            const angle = Math.random()*Math.PI*2;
            this.stars.push({
                radius: radius,
                angle: angle,
                size: Math.round(1.4 + Math.random()*0.5),
                color: randomFrom(cfg.starColors)
            });
        }
    }
    isOnscreen(x, y, size) {
        return (x + size >= 0 && x - size < this.width && y + size >= 0 && y - size < this.height);
    }
    update(ctx) {
        this.binaries.forEach(b => b.update(ctx, this.centerX, this.centerY, this.skySpeed));
        this.trinaries.forEach(t => t.update(ctx, this.centerX, this.centerY, this.skySpeed));
        this.stars.forEach(star=>{
            const x = this.centerX + star.radius*Math.cos(star.angle);
            const y = this.centerY + star.radius*Math.sin(star.angle);
            if ( this.isOnscreen(x, y, star.size) ) {
                ctx.fillStyle = star.color;
                ctx.beginPath();
                ctx.arc(x, y, star.size, 0, Math.PI*2);
                ctx.fill();
            }
            star.angle += this.skySpeed; // update whether drawn or not - else they'll be somewhere weird in the sky
        });
    }
}