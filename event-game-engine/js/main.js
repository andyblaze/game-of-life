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
import CanvasMap from "./canvas-map.js";
//import SvgMap from "./svg-map.js";
import SteeringSystem from "./steering-system.js";
import Perlin from "./perlin.js";
import SteeringFeelers from "./steering-feelers.js";

$(document).ready( async function() {
    checkOrientation();
    $(window).on("resize", checkOrientation); 
    const canvas = $("#world-canvas")[0];
    const map = new CanvasMap(canvas, "#svg-map");//SvgMap($("#svg-map")[0]); //CanvasMap(canvas, "#svg-map");
    await map.load();
    const eventBus = new EventBus();
    const engine = new Engine();
    engine.add(new MessageSystem(eventBus));
    engine.add(new Renderer(eventBus));
    engine.add(new SteeringSystem(eventBus, new Perlin(), new SteeringFeelers(map)));
    createCoreSystems(eventBus, config).forEach(sys => engine.add(sys));
    engine.add(new Player(eventBus, { "x": 543, "y": 68 }));
    const raf = new RafLoop();
    raf.setHandler((dt) => {
        engine.update(dt);
    });
    raf.start();
});
