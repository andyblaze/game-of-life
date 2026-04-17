import Star from "./star.js";

export default class Galaxy {
    constructor(cfg, s, p) {
        this.cfg = cfg;
        this.ship = s;
        this.perspective = p;
        this.stars = [];
        // initial field ahead of ship
        for ( let i = 0; i < cfg.STAR_COUNT; i++ ) 
            this.stars.push(new Star(cfg)); 
    }
    render(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.cfg.width, this.cfg.height);
        for ( let star of this.stars ) {
            star.update();
            // recycle when passed behind ship
            if ( star.z < this.ship.z - 200 ) {
                star.recycle(this.ship.z + this.cfg.DEPTH_SPREAD);
            }
            
            const p = this.perspective.project(star, this.ship, this.cfg);
            // behind or too close → skip rendering
            if ( p.dz <= 0 ) continue;

            star.render(ctx, p);
        }
    }
}