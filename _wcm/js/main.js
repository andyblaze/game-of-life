import placeAdder from "./place-adder.js";
import { wndEvent, addEvent, addClass, remClass, setText, checkOrientation, byId, mt_rand } from "./functions.js";

const p = new placeAdder();
p.init();

wndEvent("load", checkOrientation);
wndEvent("resize", checkOrientation);

class SeaEvents {
    messages = [
        "The sea is calm. Nothing terrible has happened yet.",
        "A distant gull watches you with unsettling intelligence.",
        "The tide is doing something… suspicious.",
        "Someone swears they saw bubbles spelling a warning.",
        "The sea remains calm. This is probably a lie.",
        "A faint chanting can be heard. It might just be the wind.",
        "Absolutely nothing is wrong. Stop asking.",
        "The water looks normal. Too normal."
    ];
    constructor(id) {
        this.eventTimer = 0;
        this.nextEventTime = this.randomDelay();
        this.eventsEl = byId(id);
        this.animating = false;
    }
    randomDelay() {
        return mt_rand(2000, 6000); // ms
    }
    update(dt) {
        if (this.animating) return;
        this.eventTimer += dt;
        if ( this.eventTimer >= this.nextEventTime ) {
            this.eventTimer = 0;
            this.nextEventTime = this.randomDelay();
            const msg = this.messages[mt_rand(0, this.messages.length - 1)];
            this.setMessage(msg);
        }
    }
setMessage(msg) {
  if (this.animating) return;
  this.animating = true;

  const el = this.eventsEl;

  // listener for fadeOut completion
  const fadeOutEnd = () => {
    el.removeEventListener("animationend", fadeOutEnd);
    
    // update text and start fadeIn
    el.textContent = msg;
    el.classList.remove("is-changing");
    el.classList.add("in");

    // listener for fadeIn completion
    const fadeInEnd = () => {
      el.removeEventListener("animationend", fadeInEnd);
      el.classList.remove("in");
      this.animating = false;
    };

    el.addEventListener("animationend", fadeInEnd);
  };

  el.addEventListener("animationend", fadeOutEnd);

  // trigger fadeOut
  el.classList.add("is-changing");
  el.offsetHeight; // force reflow to ensure animation starts
}

    setMessage1(msg) { console.log(msg);
        if (this.animating) return;   // 🔒 guard
        this.animating = true;
        addClass(this.eventsEl, "is-changing");
        this.eventsEl.offsetHeight; // force reflow
        addEvent(this.eventsEl, "animationend", () => {            
            setText(this.eventsEl, msg);
            remClass(this.eventsEl, "is-changing");
            addClass(this.eventsEl, "in");
            this.eventsEl.offsetHeight;
            addEvent(this.eventsEl, "animationend", () => {
                remClass(this.eventsEl, "in");
                this.animating = false;   // 🔓 unlock
            }, { once: true });
        }, { once: true });
    }
}

class AmbientEvents {
    constructor() {
        this.observers = [];
    }
    add(o) {
        this.observers.push(o);
    }
    notify(dt) {
        for ( let o of this.observers )
            o.update(dt);
    }
}

const ambientEvents = new AmbientEvents();
ambientEvents.add(new SeaEvents("events-text"));

let lastTime = 0;
function animate(time) {
    const dt = (time - lastTime); // ms
    lastTime = time;
    ambientEvents.notify(dt);
    requestAnimationFrame(animate);
}

animate(performance.now());