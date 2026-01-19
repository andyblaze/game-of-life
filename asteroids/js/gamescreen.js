export default class GameScreen {
  constructor(canvasId) {
    this.canvas = $(canvasId)[0];
    this.ctx = this.canvas.getContext("2d");
    this.canvasW = 0;
    this.canvasH = 0;
    this.resize();

    // Keep canvas full screen when the browser resizes
    $(window).on("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvasW = this.canvas.width;
    this.canvasH = this.canvas.height;
  }
    clear() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvasW, this.canvasH);
    }
}
