//import placeAdder from "./place-adder.js";
//import { SeaEvents, WeatherEvents, FishEvents, LandEvents, PeopleEvents } from "./sea-events.js";
//import TownPopup from "./town-popup.js";
import { config } from "./config.js";
//import EventsObservable from "./events-observable.js";
//import { checkOrientation } from "./functions.js";
import RafLoop from "./raf-loop.js";
import Engine from "./engine.js";
import SeaSystem from "./sea-system.js";
import WeatherSystem from "./weather-system.js";
import PeopleSystem from "./people-system.js";
import EventBus from "./event-bus.js";
import MessageSystem from "./message-system.js";
import Mood from "./mood.js";

$(document).ready(function() {
    const eventBus = new EventBus();
    const engine = new Engine();
    engine.add(new SeaSystem(eventBus, config.sea_messages));
    engine.add(new WeatherSystem(eventBus, config.weather_messages));
    engine.add(new PeopleSystem(eventBus, config.people_messages));
    engine.add(new MessageSystem(eventBus));
    engine.add(new Mood(eventBus, config.moods));
    const raf = new RafLoop();
    raf.setHandler((dt) => {
        engine.update(dt);
    });
    raf.start();
});

//$(window).on("resize", checkOrientation);
