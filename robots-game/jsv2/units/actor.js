import { mt_rand } from "../functions.js";

export default class Actor {
    constructor(tile, color="red") {
        this.tileSize = tile.size; 
        this.color = color;
        this.image = null;
        // Pixel position for smooth movement
        this.x = 0; 
        this.y = 0; 
        this.setTile(tile); 
        this.size = this.tileSize * 0.6; // rectangle size
        this.speed = mt_rand(2, 16) * 10; // → pixels per second
        this.timer = "delta";
    }
    tileToWorld(tile) {
        return {
            x: tile.col * this.tileSize + this.tileSize / 2,
            y: tile.row * this.tileSize + this.tileSize / 2
        };
    }
    update(deltaTime) {
        if (!this.path || this.pathIndex >= this.path.length) return;

        const targetTile = this.path[this.pathIndex];
        const { x, y } = this.tileToWorld(targetTile);
        const targetX = x;
        const targetY = y;

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.hypot(dx, dy);

        const step = this.speed * deltaTime;

        if (dist <= step) {
            // arrive at tile
            this.x = targetX;
            this.y = targetY;
            this.tile = targetTile;
            this.pathIndex++;
        } else {
            // move toward tile
            this.x += (dx / dist) * step;
            this.y += (dy / dist) * step;
        }
    }
    renderImg(ctx) {
        
    }
    render(ctx, timers) {
        this.update(timers[this.timer]);
        if ( this.image )
            this.renderImg(ctx);
        else {
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.x - this.size / 2,
                this.y - this.size / 2,
                this.size,
                this.size
            );
        }
    }
    // Utility: set tile and update pixel position
    setTile(tile) {
        this.tile = tile;
        const { x, y } = this.tileToWorld(tile);
        this.x = x;
        this.y = y;
    }
}