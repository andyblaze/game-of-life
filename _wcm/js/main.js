import placeAdder from "./place-adder.js";
import SeaEvents from "./sea-events.js";
import TownPopup from "./town-popup.js";
import EventsObservable from "./events-observable.js";
import RafLoop from "./raf-loop.js";
import { checkOrientation, lerpColor, randomFrom } from "./functions.js";

class SeaColor {
  constructor(targetSelector) {
    this.$el = $(targetSelector);

    // Sea "moods"
    this.moods = [
      { h: 191, s: 87, l: 47, a: 1 }, // tropical (too nice)
      { h: 219, s: 77, l: 48, a: 1 }, // normal blue
      { h: 224, s: 58, l: 46, a: 1 }, // deep Atlantic
      { h: 200, s: 47, l: 37, a: 1 }  // steel grey
    ];

    this.current = { ...this.moods[0] };
    this.target = this.pickNewTarget();
    this.currentIdx = 0;

    this.speed = 0.00005; // lerp per ms (slow)
  }

  pickNewTarget() {
    /*this.currentIdx++;
    if ( this.currentIdx >= this.moods.length )
        this.currentIdx = 0;*/
    let next;
    do {
      next = randomFrom(this.moods);//[Math.floor(Math.random() * this.moods.length)];
    } while (next === this.target);
    return { ...next };//this.moods[this.currentIdx] };
  }

  notify(dt) {
    dt = Math.min(dt, 100);

    const t = dt * this.speed;

    this.current = lerpColor(this.current, this.target, t);
    this.apply();

    if (this.isCloseEnough()) {
      this.target = this.pickNewTarget();
    }
  }

  isCloseEnough() {
    return (
      Math.abs(this.current.h - this.target.h) < 0.2 &&
      Math.abs(this.current.s - this.target.s) < 0.2 &&
      Math.abs(this.current.l - this.target.l) < 0.2
    );
  }

  apply() {
    const c = this.current;
    this.$el.css(
      "background-color",
      `hsla(${c.h}, ${c.s}%, ${c.l}%, ${c.a})`
    );
  }
}



$(document).ready(function() {
    const p = new placeAdder();
    p.init();    
    const ambientEvents = new EventsObservable();
    ambientEvents.add(new SeaEvents($("#events-text")));
    const sc = new SeaColor("#map");
    const townPopup = new TownPopup("#town-popup");
    const raf = new RafLoop();
    raf.setHandler((dt) => {
        sc.notify(dt);
        ambientEvents.notify(dt);
    });
    raf.start();
});

$(window).on("resize", checkOrientation);
