//import placeAdder from "./place-adder.js";
import { config } from "./config.js";
import { checkOrientation } from "./functions.js";
import { createCoreSystems } from "./systems.js";
import RafLoop from "./raf-loop.js";
import Engine from "./engine.js";
import EventBus from "./event-bus.js";
import MessageSystem from "./message-system.js";
import Renderer from "./renderer.js";
import Player from "./player.js";

$(document).ready(function() {
    checkOrientation();
    $(window).on("resize", checkOrientation); 
    const eventBus = new EventBus();
    const engine = new Engine();
    engine.add(new MessageSystem(eventBus));
    engine.add(new Renderer(eventBus));
    createCoreSystems(eventBus, config).forEach(sys => engine.add(sys));
    engine.add(new Player(eventBus, { "x": 563, "y": 118 }));
    const raf = new RafLoop();
    raf.setHandler((dt) => {
        engine.update(dt);
    });
    raf.start();
});
