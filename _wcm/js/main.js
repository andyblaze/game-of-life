import placeAdder from "./place-adder.js";
import { SeaEvents, WeatherEvents, FishEvents, LandEvents, PeopleEvents } from "./sea-events.js";
import TownPopup from "./town-popup.js";
import { config } from "./config.js";
import EventsObservable from "./events-observable.js";
import RafLoop from "./raf-loop.js";
import { checkOrientation } from "./functions.js";
import SeaColor from "./sea-color.js";
import SvgMap from "./svg-map.js";

const $svg = $("#svg-map");
const map  = new SvgMap($svg[0]);

const svgm = $("#map svg");
svgm.on("click", function(e) {
  const { x, y } = map.screenToWorld(e);
  console.log("World coords:", Math.floor(x), Math.floor(y));
});

$(document).ready(function() {
    //const p = new placeAdder();
    //p.init();    
    const ambientEvents = new EventsObservable();
    ambientEvents.add(new SeaEvents($("#sea-text"), config.sea_messages));
    ambientEvents.add(new WeatherEvents($("#weather-text"), config.weather_messages));
    ambientEvents.add(new FishEvents($("#fish-text"), config.fish_messages));
    ambientEvents.add(new LandEvents($("#land-text"), config.land_messages));
    ambientEvents.add(new PeopleEvents($("#people-text"), config.people_messages));
    const seaColor = new SeaColor($("#map"), config.sea_change);
    const townPopup = new TownPopup("#town-popup");
    const raf = new RafLoop();
    raf.setHandler((dt) => {
        seaColor.notify(dt);
        ambientEvents.notify(dt);
    });
    raf.start();
});

$(window).on("resize", checkOrientation);
