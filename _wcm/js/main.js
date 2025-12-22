import placeAdder from "./place-adder.js";
import SeaEvents from "./sea-events.js";
import TownPopup from "./town-popup.js";
import { config } from "./config.js";
import EventsObservable from "./events-observable.js";
import RafLoop from "./raf-loop.js";
import { checkOrientation } from "./functions.js";
import SeaColor from "./sea-color.js";


$(document).ready(function() {
    const p = new placeAdder();
    p.init();    
    const ambientEvents = new EventsObservable();
    ambientEvents.add(new SeaEvents($("#events-text"), config.sea_messages));
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
