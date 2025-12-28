export default class Renderer {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on("message:emit", (data) => {
            this.onMessage(data);
        });
        this.eventBus.on("sea:colorchanged", (data) => {
            this.onColorChange(data);
        });
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
