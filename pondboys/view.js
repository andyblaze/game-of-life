export default class View {
    constructor(id, config) {
        this.onscreen = document.getElementById(id);
        this.onCtx = this.onscreen.getContext("2d");
        this.offscreen = document.createElement("canvas");
        this.offCtx = this.offscreen.getContext("2d");
        this.cfg = config;
    }
    resize(w, h) {
        this.onscreen.width = w;
        this.onscreen.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
    }

    draw(data) {
        // background water
        this.offCtx.fillStyle = "rgba(20, 40, 60, 1)";
        this.offCtx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);
        // draw critters
        data.critters.forEach(c => {
            this.offCtx.beginPath();
            this.offCtx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            // energy -> alpha mapping
            const alpha = Math.min(c.energy / 100, 1); // cap at 1
            this.offCtx.fillStyle = c.color.replace(/[\d\.]+\)$/g, `${alpha})`);
            //this.offCtx.fillStyle = c.color;
            this.offCtx.fill();
        });
        data.food.forEach(f => {
            this.offCtx.beginPath();
            this.offCtx.arc(f.x, f.y, f.r, 0, Math.PI*2);
            this.offCtx.fillStyle = f.color;
            this.offCtx.fill();
        });
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}