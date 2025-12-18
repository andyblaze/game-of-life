import placeAdder from "./place-adder.js";
import { wndEvent, checkOrientation, byId, mt_rand } from "./functions.js";

const p = new placeAdder();
p.init();

wndEvent("load", checkOrientation);
wndEvent("resize", checkOrientation);

const seaEvents = [
  "The sea is calm. Nothing terrible has happened yet.",
  "A distant gull watches you with unsettling intelligence.",
  "The tide is doing something… suspicious.",
  "Someone swears they saw bubbles spelling a warning.",
  "The sea remains calm. This is probably a lie.",
  "A faint chanting can be heard. It might just be the wind.",
  "Absolutely nothing is wrong. Stop asking.",
  "The water looks normal. Too normal."
];
let eventTimer = 0;
let nextEventTime = mt_rand(2, 10);

const eventsEl = byId("events-text");

function updateSeaEvents(dt) {
    eventTimer += dt;

    if (eventTimer >= nextEventTime) {
        eventTimer = 0;
        nextEventTime = mt_rand(2, 10);
        setRandomSeaEvent();
    }
}
function setRandomSeaEvent() {
    const msg = seaEvents[mt_rand(0, seaEvents.length - 1)];
    eventsEl.textContent = msg;
}

let lastTime = 0;
function animate(time) {
    const dt = (time - lastTime) / 1000; // seconds
    lastTime = time;
    updateSeaEvents(dt);
    requestAnimationFrame(animate);
}

animate(performance.now());