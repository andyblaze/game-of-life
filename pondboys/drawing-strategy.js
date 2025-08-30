class CritterDrawing {
    constructor() {}
    fixAlpha(c) {
        const alpha = Math.min(c.energy / 100, 1);
        c.color[3] = alpha;
        return "rgba(" + c.color.join(",") + ")";
    }
}
export class PreyDrawing extends CritterDrawing {
    constructor() {
        super();
    }
    draw(ctx, critter) {
        const c = critter;

        // create radial gradient: lighter in center, darker at edges
        const grad = ctx.createRadialGradient(c.x, c.y, c.radius * 0.1, c.x, c.y, c.radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(c.energy / 100, 1)})`); // bright center
        grad.addColorStop(1, this.fixAlpha(c));   // darker edge

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
class PredatorDrawing extends CritterDrawing {
    constructor() {
        super();
        this.init();
    }
    init() {
        this.nucleusAngle = Math.random() * Math.PI * 2;
        this.nucleusColor = [255,255,255,0.3];
        this.organellePhase = Math.random() * Math.PI * 2;
        this.organelleColor = "rgba(0,0,0,0.4)";    
    }
    draw(ctx, critter) {
        const c = critter;
        // orbit nucleus slowly
        const phase = critter.id * 0.1; // or Math.random() seeded per critter
        this.nucleusAngle += 0.01; // try 0.005 for slower, 0.02 for faster
        const angle = this.nucleusAngle + phase;
        // body
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.fixAlpha(c);
        ctx.fill(); 
        // === DNA signature bits ===

        // nucleus (a dot offset from center)
        const nucleusOffset = c.radius * 0.3;
        ctx.beginPath();
        ctx.arc(
            c.x + nucleusOffset * Math.cos(angle),
            c.y + nucleusOffset * Math.sin(angle),
            c.radius * 0.2, 0, Math.PI * 2
        );
        //this.nucleusColor[3] = c.color[3];
        ctx.fillStyle = "rgba(" + this.nucleusColor.join(",") + ")";
        ctx.fill();

        // organelles (curved squiggles inside body)
        const organelleCount = 2;
        for ( let i = 0; i < organelleCount; i++ ) {
            const angle = (i / organelleCount) * Math.PI * 2 + this.organellePhase;
            const r = c.radius * 0.5;
            const cx = c.x + r * Math.cos(angle);
            const cy = c.y + r * Math.sin(angle);

            ctx.beginPath();
            ctx.strokeStyle = this.organelleColor;
            ctx.lineWidth = 3;
            ctx.moveTo(cx - 3, cy - 2);
            ctx.quadraticCurveTo(cx, cy + 3, cx + 3, cy - 2); // simple bent line
            ctx.stroke();
        }     
    }
}

export class VampireDrawing extends PredatorDrawing {}
export class BasherDrawing extends PredatorDrawing {
    draw(ctx, critter) {
        const c = critter;
        const outer = c.radius;
        const thickness = outer * 0.4; // ring thickness, tweakable
        const inner = outer - thickness;

        // outer gradient ring
        const grad = ctx.createRadialGradient(c.x, c.y, inner, c.x, c.y, outer);
        grad.addColorStop(0, this.fixAlpha(c));              // inner edge
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);      // fade outward

        ctx.fillStyle = grad;

        // draw donut
        ctx.beginPath();
        ctx.arc(c.x, c.y, outer, 0, Math.PI * 2);
        ctx.arc(c.x, c.y, inner, 0, Math.PI * 2, true); // cut out center
        ctx.closePath();
        ctx.fill();
    }
}
