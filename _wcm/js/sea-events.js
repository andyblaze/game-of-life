import { mt_rand } from "./functions.js";

export default class SeaEvents {
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
        this.eventElmt = id;
    }
    randomDelay() {
        return mt_rand(2000, 6000); // ms
    }
    update(dt) {
        this.eventTimer += dt;
        if ( this.eventTimer >= this.nextEventTime ) {
            this.eventTimer = 0;
            this.nextEventTime = this.randomDelay();
            const msg = this.messages[mt_rand(0, this.messages.length - 1)];
            this.setMessage(msg);
        }
    }
    setMessage(msg) {
        this.eventElmt.fadeOut(600, function() {
            $(this).text(msg).fadeIn(600);
        });
    }
}