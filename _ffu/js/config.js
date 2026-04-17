export default class Config {
    constructor(canvasId) {
        this.STAR_COUNT = 120;
        this.DEPTH_SPREAD = 4000;
        this.planetTypes = ["rocky", "desert", "ice", "gas"];
        this.palettes = {
            rocky: ["#2e4b2f", "#3a6b4a", "#1f3d5c", "#6b4f3a", "#7a7a7a"],
            desert: ["#b55239", "#c46a2f", "#8c3b2a", "#d18b55"],
            ice: ["#cfe9ff", "#9fd3ff", "#bfc7d5", "#e6f2ff"],
            gas: ["#d6c6a1", "#c2a57b", "#a8835a", "#e6d6b8"]
        };
        this.starColors = ["#ffffff", "#aaccff", "#ffd28a", "#ff9a6b"];
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.resize();
    }
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
    }
}
