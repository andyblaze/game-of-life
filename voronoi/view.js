import { FullScreenOverlay, GodRay } from "./overlays.js";

export default class View {
    constructor(id, config) {
        this.onscreen = document.getElementById(id);
        this.onCtx = this.onscreen.getContext("2d");
        this.offscreen = document.createElement("canvas");
        this.offCtx = this.offscreen.getContext("2d");
        this.skyImage = new Image();
        this.skyImage.src = "sky1.jpg";
        this.overlay = new FullScreenOverlay(); 
        this.godRay = new GodRay({
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    baseHue: 200,           // start in blue range
    planktonCount: 150,
    planktonDrift: true
        });
        this.cfg = config;
    }
    resize(w, h) {
        this.onscreen.width = w;
        this.onscreen.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
    }
    overlayFog(height) {
        // --- Layered fog overlay ---
        const gradient = this.offCtx.createLinearGradient(
            0, this.offscreen.height - height, 0, this.offscreen.height
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(215, 215, 215, 0.5)');
        gradient.addColorStop(1, 'rgba(215, 215, 215, 0)');
        this.offCtx.fillStyle = gradient;
        this.offCtx.fillRect(0, this.offscreen.height - height, this.offscreen.width, height);
    }
    radialGradientFill(ctx, site, hue, alpha) {
        if ( alpha < 0.2 ) alpha = 0.2;
        const g = ctx.createRadialGradient(site.x, site.y, 0, site.x, site.y, 180);
        g.addColorStop(0, `hsla(${hue},80%,70%,${alpha})`);
        g.addColorStop(0.4, `hsla(${hue},80%,30%,0.01)`);
        g.addColorStop(1, `hsla(${hue},80%,30%,0)`);
        ctx.fillStyle = g;
        ctx.fill();        
        // Optional:  stroke to outline facets
        //ctx.strokeStyle = "rgba(0,0,255,0.01)";
        //ctx.lineWidth = 0.5;
        //ctx.stroke();    
    }
    shimmer(t, i) {
        return 0.3 + 0.2 * Math.sin(t * 0.002 + i);
    }
    InnerShadowFill(ctx, site, cell, config) {
        // cell is array of {x,y}, site is {x,y}
        ctx.beginPath();
        cell.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();

        // pick a radius heuristic
        const radius = config.gradientRadius || 120;

        // gradient: bright center -> darker edges
        const g = ctx.createRadialGradient(site.x, site.y, 0, site.x, site.y, radius);
        g.addColorStop(0, `hsla(${config.hue}, 60%, 75%, 0.5)`); // bright
        g.addColorStop(1, `hsla(${config.hue}, 60%, 25%, 0.08)`); // dark edges

        ctx.fillStyle = g;
        ctx.fill();

        // optional darker edge stroke
        //ctx.strokeStyle = `hsla(${config.hue}, 60%, 15%, 0.9)`;
        //ctx.lineWidth = 1.5;
        //ctx.stroke();
    }
    floodFill(ctx, hue, alpha) {
        ctx.fillStyle = `hsla(${hue},70%,40%,0.3)`;
        ctx.strokeStyle = `hsla(${hue},80%,70%,0.05)`;
        ctx.fill();
        ctx.stroke();
    }
    noiseDrivenFill(ctx, site, cell, perlin, time, config) { 
        ctx.beginPath();
        cell.forEach((p, i) => {
            if ( i === 0 ) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();

        // sample noise (smooth value between -1 and 1)
        const n = perlin.noise(site.nx + time * 0.0005, site.ny + time * 0.0005);

        // map noise to hue and lightness
        const hue = (config.baseHue + n * config.hueRange) % 360;
        const light = 50 + n * config.lightRange;

        ctx.fillStyle = `hsla(${hue}, 70%, ${light}%, 0.2)`;
        ctx.fill();

        //ctx.strokeStyle = `hsla(${hue}, 70%, 20%, 0.9)`;
        //ctx.lineWidth = 1;
        //ctx.stroke();
    }
    cellSizeDependentFill(ctx, site, sites) {
        function nearestNeighborDistance(site, sites) {
          let minDist = Infinity;
          for (let other of sites) {
            if (other === site) continue;
            const dx = site.x - other.x;
            const dy = site.y - other.y;
            const d = Math.hypot(dx, dy);
            if (d < minDist) minDist = d;
          }
          return minDist;
        }
        const nn = nearestNeighborDistance(site, sites);
        const radius = nn * 0.4; // tweak multiplier in config
        const hue = 70;
        const g = ctx.createRadialGradient(site.x, site.y, 0, site.x, site.y, radius);
        g.addColorStop(0, `hsla(${hue}, 70%, 75%, 0.9)`);
        g.addColorStop(1, `hsla(${hue}, 70%, 25%, 0.4)`);
        ctx.fillStyle = g;
        ctx.fill();        
    }
    facetFill(ctx, site, cell, config) {
        // --- 1. Compute centroid of the cell ---
        let cx = 0, cy = 0;
        for (let i = 0; i < cell.length; i++) {
            cx += cell[i].x;
            cy += cell[i].y;
        }
        cx /= cell.length;
        cy /= cell.length;

        // --- 2. Light direction (choose a consistent vector) ---
        const lx = -1, ly = -1; // top-left light
        const angle = Math.atan2(ly, lx);

        // --- 3. Gradient across the cell ---
        const radius = Math.max(ctx.canvas.width, ctx.canvas.height);
        const g = ctx.createLinearGradient(
            cx - Math.cos(angle) * radius,
            cy - Math.sin(angle) * radius,
            cx + Math.cos(angle) * radius,
            cy + Math.sin(angle) * radius
        );

        // --- 4. Map centroid to hue/brightness ---
        const hue = (config.baseHue + (cx + cy) * 0.05) % 360;

            // Jewel effect: hard tonal bands
        g.addColorStop(0.0, `hsl(${hue}, ${config.sat || 70}%, 80%)`);
        g.addColorStop(0.1, `hsl(${hue}, ${config.sat || 70}%, 80%)`); // repeat to create hard edge
        g.addColorStop(0.1, `hsl(${hue}, ${config.sat || 70}%, 55%)`);
        g.addColorStop(0.3, `hsl(${hue}, ${config.sat || 70}%, 55%)`);
        g.addColorStop(0.3, `hsl(${hue}, ${config.sat || 70}%, 35%)`);
        g.addColorStop(0.6, `hsl(${hue}, ${config.sat || 70}%, 35%)`);
        g.addColorStop(0.6, `hsl(${hue}, ${config.sat || 70}%, 20%)`);
        g.addColorStop(1.0, `hsl(${hue}, ${config.sat || 70}%, 20%)`);

        // --- 5. Draw polygon with gradient fill ---
        ctx.beginPath();
        ctx.moveTo(cell[0].x, cell[0].y);
        for (let j = 1; j < cell.length; j++) {
            ctx.lineTo(cell[j].x, cell[j].y);
        }
        ctx.closePath();

        ctx.fillStyle = g;
        ctx.fill();

        // Optional: subtle dark stroke to outline facets
        ctx.strokeStyle = `hsla(${hue}, ${config.sat || 70}%, 10%, 0.8)`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    draw(data) {
        this.offCtx.drawImage(this.skyImage, 0, 0, this.offscreen.width, this.offscreen.height);
        //ctx.clearRect(0, 0, width, height);
        for ( let i = 0; i < data.cells.length; i++ ) {
            const cell = data.cells[i];
            if ( cell.length < 3 ) continue;
            this.offCtx.beginPath();
            this.offCtx.moveTo(cell[0].x, cell[0].y);
            for ( let j = 1; j < cell.length; j++ ) {
                this.offCtx.lineTo(cell[j].x, cell[j].y);
            }
            this.offCtx.closePath();
            //this.noiseDrivenFill(this.offCtx, data.sites[i], cell, data.perlin, data.timestamp, this.cfg.global("cool"));
            //this.cellSizeDependentFill(this.offCtx, data.sites[i], data.sites);
            //this.InnerShadowFill(this.offCtx, data.sites[i], cell, {hue:130});
            //const hue = (data.sites[i].x / this.offscreen.width * 360 + data.timestamp * 0.02) % 360;
            
            const { base, range, speed } = this.cfg.global("ocean");
            const hue = base + Math.sin(data.timestamp * speed + data.sites[i].x * 0.01) * (range / 2);
            const alpha = this.shimmer(data.timestamp, i);
            this.radialGradientFill(this.offCtx, data.sites[i], hue, alpha);
            // this.facetFill(this.offCtx, data.sites[i], cell, this.cfg.global("facet"));
            // this.floodFill(this.offCtx, hue, alpha);
        }
        this.godRay.update(data.timestamp);
        this.godRay.draw(this.offCtx, this.offscreen.width, this.offscreen.height);
        //this.overlay.draw(this.offCtx, this.offscreen.width, this.offscreen.height);
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}