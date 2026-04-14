import { byId } from "./functions.js";

class UiPanel {
    constructor(id, grid, cfg) { 
        this.panel = byId(id);
        this.grid = grid;
        this.cfg = cfg;
        this.visible = false;
        this.hide();
        this.px = 0;
        this.py = 0; 
    }
    getSize() {
        return { 
            w: parseInt(getComputedStyle(this.panel).width), 
            h: parseInt(getComputedStyle(this.panel).height) 
        };
    }
    setOffset(tile) {
        byId("tile-type").innerText = tile.getType();
        byId("tile-building").innerText = tile.getBuilding();
        const size = this.getSize();
        // anchor to tile centre
        this.px = tile.col * this.grid.tileSize + this.grid.tileSize / 2 + 10;
        this.py = tile.row * this.grid.tileSize + this.grid.tileSize / 2 + 10;

        // flip if overflowing right
        if (this.px + size.w > this.cfg.width) {
            this.px = tile.col * this.grid.tileSize - size.w - 10;
        }

        // flip if overflowing bottom
        if (this.py + size.h > this.cfg.height) {
            this.py = tile.row * grid.tileSize - size.h - 10;
        }        
    }
    setStyle(l, t, d) {
        this.panel.style.left = `${l}px`;
        this.panel.style.top = `${t}px`;       
        this.panel.style.display = d; 
        this.visible = (d === "block");
    }
    show() {
        this.setStyle(this.px, this.py, "block")
    }
    hide() {
        this.setStyle(0, 0, "none");
    }
}

export default class UI {
    constructor(grid, cfg) {
        this.grid = grid;
        this.cfg = cfg;
        this.panel = new UiPanel("game-panel", grid, cfg);
    }
    handleCanvasClick(e) {
        const rect = this.cfg.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const tile = this.grid.getTileAtPixel(x, y);

        if (!tile) return;

        if (this.panel.visible) {
            this.panel.hide();
            return;
        }

        this.panel.setOffset(tile);
        this.panel.show();
    }
}