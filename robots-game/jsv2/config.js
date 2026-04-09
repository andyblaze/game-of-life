export default class Config {
    constructor(canvasID) {
        this.canvas = document.getElementById("game-canvas");
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.ctx = this.canvas.getContext("2d");

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.tileSize = 48;
        
        this.initialHumanPop = 6;
        this.initialRobotPop = 3;
        this.initialWorldItems = [
            "power", "bread", "iron", "coal", "wood", "wheat"
        ];
        this.terrain = [
            { type:"pond", min:1, max:3, color:"#2DA4DB", radius:[50, 120] },
            { type:"rock", min:4, max:8, color:"#888888", radius:[30, 80] },
            { type:"forest", min:2, max:6, color:"#228B22", radius:[40, 100] },
            { type:"farm", min:3, max:8, color:"#D2B48C", radius:[60, 120] }
        ];
    }
}