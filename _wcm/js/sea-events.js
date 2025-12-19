import { mt_rand, randomFrom } from "./functions.js";
import { config } from "./config.js";

export default class SeaEvents {
    messages = [];

    constructor(id) {
        this.messages = config.sea_messages;
        this.eventTimer = 0;
        this.nextEventTime = this.randomDelay();
        this.eventElmt = id;
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
        this.eventElmt.fadeOut(600, function() {
            $(this).text(msg).fadeIn(600);
        });
    }
}