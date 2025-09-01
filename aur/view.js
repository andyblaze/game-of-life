export default class View {
    constructor(id, config) {
        this.onscreen = document.getElementById(id);
        this.onCtx = this.onscreen.getContext("2d");
        this.offscreen = document.createElement("canvas");
        this.offCtx = this.offscreen.getContext("2d");
        this.skyImage = new Image();
        this.skyImage.src = "sky.jpg";        
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
    drawSkyOverlay() {
        // Keep time as a property of the View so it persists across frames
        if (this._overlayTime === undefined) this._overlayTime = 0;
        if (this._overlayDirection === undefined) this._overlayDirection = 1;

        this._overlayTime += 0.005 * this._overlayDirection;
        if (this._overlayTime > 0.7 || this._overlayTime < 0.3) this._overlayDirection *= -1;

        this.offCtx.fillStyle = `rgba(255, 0, 0,${this._overlayTime})`;
        this.offCtx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);
    }
    draw(data) {
        // background water
        //this.offCtx.fillStyle = "rgba(20, 40, 60, 1)";
        //this.offCtx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);
        this.offCtx.drawImage(this.skyImage, 0, 0, this.offscreen.width, this.offscreen.height);
        this.drawSkyOverlay();
        // draw auroras
        data.forEach(a => {
            a.draw(this.offCtx);
        });
        //this.overlayFog(350);
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}