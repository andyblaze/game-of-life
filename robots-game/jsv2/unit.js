export default class Unit {
    constructor(tile, tileSize, color = "red") {
        this.tile = tile;       // Tile object the unit is on
        this.tileSize = tileSize;       
        this.color = color;
        // Pixel position for smooth movement
        const { x, y } = this.tileToWorld(this.tile);
        this.x = x; 
        this.y = y; 
        this.size = this.tileSize * 0.6; // rectangle size
        this.speed = 160; // → pixels per second
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
    render(ctx, times) {
        this.update(times.use);
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );
    }
    // Utility: set tile and update pixel position
    setTile(tile) {
        this.tile = tile;
        const { x, y } = this.tileToWorld(tile);
        this.x = x;
        this.y = y;
    }
}