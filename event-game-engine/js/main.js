//import placeAdder from "./place-adder.js";
//import { SeaEvents, WeatherEvents, FishEvents, LandEvents, PeopleEvents } from "./sea-events.js";
//import TownPopup from "./town-popup.js";
import { config } from "./config.js";
//import EventsObservable from "./events-observable.js";
//import { checkOrientation } from "./functions.js";
import RafLoop from "./raf-loop.js";
import Engine from "./engine.js";
import SeaSystem from "./sea-system.js";
import EventBus from "./event-bus.js";
import MessageSystem from "./message-system.js";
$(document).ready(function() {
    const events = new EventBus();
    const engine = new Engine();
    engine.add(new SeaSystem(events));
    engine.add(new MessageSystem(events, config.sea_messages));
    const raf = new RafLoop();
    raf.setHandler((dt) => {
        engine.update(dt);
    });
    raf.start();
});

//$(window).on("resize", checkOrientation);
