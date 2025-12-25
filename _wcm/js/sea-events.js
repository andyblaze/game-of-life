import { mt_rand, randomFrom } from "./functions.js";

class RandomItem {
    constructor(arrLength) {
        this.recent = [];
        this.maxQueueLength = this.setQueueLength(arrLength);
    }
    setQueueLength(arrLen) {
        if ( arrLen < 2 ) return 0;
        if ( arrLen < 5 ) return 1;
        if ( arrLen < 11 ) return 2;
        return Math.floor(arrLen / 5); // 20 %
    }
    getFrom(arr) {
        console.log(this.recent.length, this.maxQueueLength, arr.length);
        let arrIdx = mt_rand(0, arr.length - 1);
        while ( this.recent.indexOf(arrIdx) !== -1 )
            arrIdx = mt_rand(0, arr.length - 1);
        this.recent.push(arrIdx);
        if ( this.recent.length > this.maxQueueLength )
            this.recent.shift();
        return arr[arrIdx];
    }
}

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