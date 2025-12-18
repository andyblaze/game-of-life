import placeAdder from "./place-adder.js";
import SeaEvents from "./sea-events.js";
import EventsObservable from "./events-observable.js";
import { checkOrientation } from "./functions.js";


const p = new placeAdder();
p.init();    
const ambientEvents = new EventsObservable();
ambientEvents.add(new SeaEvents($("#events-text")));

$(window).on("resize", checkOrientation);

let lastTime = 0;
function animate(time) {
    const dt = (time - lastTime); // ms
    lastTime = time;
    ambientEvents.notify(dt);
    requestAnimationFrame(animate);
}

animate(performance.now());