export default class Renderer {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on("message:emit", (data) => {
            this.onMessage(data);
        });
        this.eventBus.on("sea:colorchanged", (data) => {
            this.onColorChange(data);
        });
        this.eventBus.on("player:waypointed", (data) => this.drawWaypoint(data));
        this.eventBus.on("player:moved", (data) => this.drawPlayer(data));
    }
    drawPlayer(data) { 
        const canvas = $("#screen-canvas")[0];
        const ctx = canvas.getContext("2d");
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(data.x, data.y, 1.5, 0, 2 * Math.PI);     
        ctx.fill(); 
    }
    drawWaypoint(data) {
        const canvas = $("#screen-canvas")[0];
        const ctx = canvas.getContext("2d");
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(data.x, data.y, 4.5, 0, 2 * Math.PI);     
        ctx.fill();
    }
    onColorChange(rawData) {
        const data = {...rawData};
        const c = data.color;
        const selector = "body";
        const color = `hsla(${c.h}, ${c.s}%, ${c.l}%, ${c.a})`;
        this.updateBackground(selector, color);
    }
    updateBackground(selector, color) {
        $(selector).css("background-color", color);
    }
    onMessage(rawData) {
        const data = {...rawData}; 
        let selector = "#" + data.type;
        this.updateHtml(selector, data);
        selector = "." + data.type;
        this.updateHtml(selector, data);
    }
    updateHtml(selector, data) {
        $(selector).html(data.msg);
    }
}
