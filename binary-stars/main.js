import { config } from "./config.js";
import Controller from "./controller.js";
import Model from "./model.js";
import View from "./view.js";
import { resize } from "./functions.js";

window.addEventListener("DOMContentLoaded", () => {
    resize();
    const controller = new Controller(
        new Model(config), 
        new View(config), 
        config
    );
    controller.animate(performance.now());
});