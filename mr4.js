import config from "./config.js";
import Controller from "./controller.js";
import Model from "./model.js";
import Renderer from "./renderer.js";

window.addEventListener("DOMContentLoaded", () => {
    const controller = new Controller(
        new Model(config), 
        new Renderer("onscreen", config), 
        config
    );
    window.addEventListener("resize", controller.resize.bind(controller));
    window.addEventListener("click", function() {controller.paused = ! controller.paused;});
    controller.resize();
    controller.loop();
});
