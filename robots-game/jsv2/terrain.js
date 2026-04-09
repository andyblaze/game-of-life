export default class Terrain {
    constructor(generator, simplex) {
        this.patches = generator.generate();
        this.simplex = simplex;
        this.timer = "noise";
    }
    render(ctx, timers) {
        this.patches.forEach(p => {
            if( p.type==="pond" ) this.draw(ctx, p, timers[this.timer]); // --- Animate ponds ---
            else this.draw(ctx, p);
        });    
    }
    draw(ctx, patch, t=0){ // --- Draw wobbling patch if t != 0 ---
        const points = 80;
        ctx.beginPath();
        for( let i=0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const wobble = this.simplex.noise(Math.cos(angle) + patch.x, Math.sin(angle) + patch.y + t) * patch.r * 0.2;
            const r = patch.r + wobble;
            const px = patch.x + Math.cos(angle) * r;
            const py = patch.y + Math.sin(angle) * r;
            if( i===0 ) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = patch.color;
        ctx.fill();
    }
}