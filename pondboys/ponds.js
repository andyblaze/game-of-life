import Config from "./config.js";
import Controller from "./controller.js";
import Model from "./model.js";
import View from "./view.js";

window.addEventListener("DOMContentLoaded", () => {
    const controller = new Controller(
        new Model(Config), 
        new View("onscreen", Config), 
        Config
    );
    window.addEventListener("resize", controller.resize.bind(controller));
    window.addEventListener("click", function() {controller.paused = ! controller.paused;});
    controller.resize();
    controller.loop();
});
