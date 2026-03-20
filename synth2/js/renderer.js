export default class Renderer {
    constructor(canvasId) {
        this.lineW = 2;
        this.fill = "#000000";
        this.stroke = "#ffffff";
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = this.lineW;
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;

        this.resize();
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    draw(data) {
        const ctx = this.ctx;
        //const w = this.canvas.width;
        //const h = this.canvas.height;

        // clear
        //ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.w, this.h);

        //ctx.lineWidth = 2;
        ctx.strokeStyle = "white";

        ctx.beginPath();

        const slice = this.w / data.length;

        for (let i = 0; i < data.length; i++) {
            const v = data[i] / 128.0; // 0–255 → ~0–2
            const y = (v * this.h) / 2;

            if (i === 0) ctx.moveTo(0, y);
            else ctx.lineTo(i * slice, y);
        }

        ctx.stroke();
    }
}
