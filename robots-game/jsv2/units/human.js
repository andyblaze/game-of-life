import Tickable from "../base-classes/tickable.js";

export default class Human extends Tickable {
    constructor(actor) {
        super();
        this.actor = actor;
        this.actor.image = "images/human.png";
        this.hunger = 10;
        this.hungerThreshold = 50;
        this.prevHunger = 10;
        this.morale = 80;
        this.hungerRate = 0.8 + Math.random() * 0.4;
    }

    consume(world) {
        this.prevHunger = this.hunger;
        this.hunger += this.hungerRate;

        if (this.hunger > this.hungerThreshold) {
            const eaten = world.consume({ type: "bread", amount: 1 });
            if (eaten) {
                this.hunger -= 10;
                this.morale += 1;
            } else {
                this.morale -= 1;
            }
        }
        if ( this.prevHunger < this.hungerThreshold && this.hunger > this.hungerThreshold ) {
            const evt = { type: "state-change", source: "human", state: "hungry" };
            world.emitEvent(evt);
        }
        if ( this.prevHunger > this.hungerThreshold && this.hunger < this.hungerThreshold ) {
            const evt = { type: "state-change", source: "human", state: "full" };
            world.emitEvent(evt);
        }

    }
} 