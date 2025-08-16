
export default class GlowingChar {
    static layers = 11;
    static layerAlphas = this.precomputeAlphas();
    
    static precomputeAlphas() {
        let result = [];
        const half = Math.floor(this.layers / 2);
        const maxAlpha = 1.0;
        const minAlpha = 0.01;

        for (let i = 0; i <= half; i++) {
            const t = 1 - i / half;
            const curve = Math.sin(t * Math.PI);
            result[i] = minAlpha + curve * (maxAlpha - minAlpha);
        }
        return result;
    }
    static draw(ctx, txt, point, fill, alpha) {
        const {x, y} = point;
        const half = Math.floor(this.layers / 2); // middle index
        for ( let i = 1; i <= half; i++ ) {
            const layerAlpha = this.layerAlphas[i] * alpha;   
            ctx.fillStyle = "rgba(0,255,0," + layerAlpha + ")"; 
            
            const offset = i * 0.5; 
            ctx.fillText(txt, x + offset, y);
            ctx.fillText(txt, x - offset, y);
            ctx.fillText(txt, x, y + offset);
            ctx.fillText(txt, x, y - offset);
        }
        ctx.fillStyle = "rgba(" + fill.join(",") + ",1)"; // final color
        ctx.fillText(txt, x, y);
        ctx.fillText(txt, x, y);
    }
}