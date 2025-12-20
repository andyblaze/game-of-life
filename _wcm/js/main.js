import placeAdder from "./place-adder.js";
import SeaEvents from "./sea-events.js";
import TownPopup from "./town-popup.js";
import EventsObservable from "./events-observable.js";
import RafLoop from "./raf-loop.js";
import { checkOrientation } from "./functions.js";

class SeaColor {
  constructor(targetSelector) {
    this.$el = $(targetSelector);

    // Base colour (Cornish, sensible)
    this.hue = 205;        // blue-grey
    this.sat = 55;         // not tropical
    this.light = 85;       // pale sea
    this.alpha = 1;

    // Drift configuration
    this.hueSpeed = 0.0200; // degrees per ms (very slow)
    this.hueMin = 190;
    this.hueMax = 220;
    this.direction = 1;
  }

  notify(dt) {
    // dt in milliseconds
    this.hue += this.hueSpeed * dt * this.direction;

    // Gentle bounce at limits
    if (this.hue > this.hueMax) {
      this.hue = this.hueMax;
      this.direction = -1;
    } else if (this.hue < this.hueMin) {
      this.hue = this.hueMin;
      this.direction = 1;
    }

    this.apply();
  }

  apply() {
    this.$el.css(
      "background-color",
      `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${this.alpha})`
    );
  }
}


$(document).ready(function() {
    const p = new placeAdder();
    p.init();    
    const ambientEvents = new EventsObservable();
    ambientEvents.add(new SeaEvents($("#events-text")));
    const sc = new SeaColor("body");
    const townPopup = new TownPopup("#town-popup");
    const raf = new RafLoop();
    raf.setHandler((dt) => {
        sc.notify(dt);
        ambientEvents.notify(dt);
    });
    raf.start();
});

$(window).on("resize", checkOrientation);
