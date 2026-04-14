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

        this.GAME_TICK_RATE = 1000; // ms between ticks
        
        this.initialHumanPop = 6;
        this.initialRobotPop = 3;
        this.initialWorldItems = [
            "power", "bread", "iron", "coal", "wood", "wheat"
        ];
        this.terrain = [
            { type:"pond", min:1, max:3, color:"#2DA4DB", radius:[50, 120] },
            { type:"iron", min:2, max:4, color:"#888888", radius:[30, 80] },
            { type:"coal", min:2, max:4, color:"#443c3c", radius:[30, 80] },
            { type:"wood", min:2, max:6, color:"#228B22", radius:[40, 100] },
            { type:"wheat", min:3, max:6, color:"#D2B48C", radius:[60, 120] }
        ];
        this.actorImages = {
            human: "images/human.png",
            robot: "images/robot.png"
        }; 
    }
}