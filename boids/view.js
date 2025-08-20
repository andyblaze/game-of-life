export default class View {
    constructor(id) {
        this.onscreen = document.getElementById(id);
        this.onCtx = this.onscreen.getContext("2d");
        this.offscreen = document.createElement("canvas");
        this.offCtx = this.offscreen.getContext("2d");
        this.skyImage = new Image();
this.skyImage.src = "sky.jpg";
    }

    resize(w, h) {
        this.onscreen.width = w;
        this.onscreen.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
    }

    draw(boids) {
        //this.offCtx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
        //this.offCtx.globalCompositeOperation = "source-over";
this.offCtx.drawImage(this.skyImage, 0, 0, this.offscreen.width, this.offscreen.height);
        //const ctx = this.ctx;
        //this.offCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

this.offCtx.fillStyle = "rgba(0,0,0,0.5)";
    boids.forEach(boid => {
        const { x, y } = boid.position;
        const angle = Math.atan2(boid.velocity.y, boid.velocity.x);

        const size = 8;       // length of the boid
        const halfBase = 4;   // half of the width

        this.offCtx.save();
        this.offCtx.translate(x, y);
        this.offCtx.rotate(angle);

        this.offCtx.beginPath();
        this.offCtx.moveTo(size, 0);             // tip
        this.offCtx.lineTo(-size, halfBase);     // back right
        this.offCtx.lineTo(-size, -halfBase);    // back left
        this.offCtx.closePath();

        this.offCtx.fill();
        this.offCtx.restore();
    });
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}