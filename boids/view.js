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
    drawBoid(scale) {
        this.offCtx.beginPath();
        this.offCtx.moveTo(0, 0);     
        this.offCtx.lineTo(-5 * scale, -2 * scale);  
        this.offCtx.lineTo(-3 * scale, 0);    
        this.offCtx.lineTo(-5 * scale, 2 * scale);    
        this.offCtx.closePath();
        this.offCtx.fill();    
    }
    draw(boids) {
        this.offCtx.drawImage(this.skyImage, 0, 0, this.offscreen.width, this.offscreen.height);
        this.offCtx.fillStyle = "rgba(0,0,0,0.2)";
        boids.forEach(boid => {

            //const size = 8;       // length of the boid
            //const halfBase = 4;   // half of the width

            this.offCtx.save();
            
            const { x, y } = boid.position;
            const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
            this.offCtx.translate(x, y);
            this.offCtx.rotate(angle);
            
            const scale = 2.8; // more = bigger boid on screen

            this.drawBoid(scale);
            
            this.offCtx.restore();
        });
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}