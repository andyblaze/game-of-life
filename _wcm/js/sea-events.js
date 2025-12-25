import { RandomItem } from "./utils.js";
import { mt_rand } from "./functions.js";

class AmbientEvents {
    constructor(id, cfg) {
        this.messages = cfg;
        this.eventTimer = 0;
        this.nextEventTime = this.randomDelay();
        this.el = id;
        this.randomItem = new RandomItem(this.messages.length);
        this.setMessage(this.randomMessage());
    }
    randomDelay() {
        return mt_rand(2000, 6000); // ms
    }
    randomMessage() {
        return this.randomItem.getFrom(this.messages);
    }
    update(dt) {
        this.eventTimer += dt;
        if ( this.eventTimer >= this.nextEventTime ) {
            this.eventTimer = 0;
            this.nextEventTime = this.randomDelay();
            this.setMessage(this.randomMessage());
        }
    }
    setMessage(msg) {
        this.el.fadeOut(600, function() {
            $(this).text(msg).fadeIn(600);
        });
    }
}

export class SeaEvents extends AmbientEvents {}
export class WeatherEvents extends AmbientEvents {}
export class FishEvents extends AmbientEvents {}
export class LandEvents extends AmbientEvents {}
export class PeopleEvents extends AmbientEvents {}
    /*constructor(id, cfg) {
        this.messages = cfg;
        this.eventTimer = 0;
        this.nextEventTime = this.randomDelay();
        this.el = id;
        this.lastMessage = this.messages[0];
        this.setMessage(this.messages[0]);
    }
    randomDelay() {
        return mt_rand(2000, 6000); // ms
    }
    update(dt) {
        this.eventTimer += dt;
        if ( this.eventTimer >= this.nextEventTime ) {
            this.eventTimer = 0;
            this.nextEventTime = this.randomDelay();
            let msg = randomFrom(this.messages);
            while ( msg === this.lastMessage )
                msg = randomFrom(this.messages);
            this.lastMessage = msg;
            this.setMessage(msg);
        }
    }
    setMessage(msg) {
        this.el.fadeOut(600, function() {
            $(this).text(msg).fadeIn(600);
        });
    }
}*/