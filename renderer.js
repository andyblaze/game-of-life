
export default class Renderer {
    constructor(id, cfg) {
        this.cfg = cfg;
        this.canvasInit(id);
    }
    canvasInit(id) {
        this.onscreen = document.getElementById(id);
        this.onCtx = this.onscreen.getContext("2d");
        this.offscreen = document.createElement("canvas");
        this.offCtx = this.offscreen.getContext("2d");
        this.resetCtx();
    }
    resetCtx() {
        this.offCtx.textAlign = "center";
        this.offCtx.textBaseline = "top";
        this.offCtx.font = this.cfg.font;
        this.offCtx.fillStyle = this.cfg.fillColor;
    }
    resize(w, h) {
        this.onscreen.width = w;
        this.onscreen.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
        this.resetCtx();
    }
    draw(data) {
        this.offCtx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
        for ( const lane of data ) {
            for ( const drop of lane.drops )
                drop.draw(this.offCtx);
        }        
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}
