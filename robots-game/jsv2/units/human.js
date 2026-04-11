import Tickable from "../base-classes/tickable.js";

export default class Human extends Tickable {
    constructor(actor) {
        super();
        this.actor = actor;
        this.hunger = 10;
        this.morale = 80;
        this.hungerRate = 0.8 + Math.random() * 0.4;
    }

    consume(world) {
        this.hunger += this.hungerRate;

        if (this.hunger > 50) {
            const eaten = world.consume({ type: "bread", amount: 1 });
            if (eaten) {
                this.hunger -= 10;
                this.morale += 1;
            } else {
                this.morale -= 1;
            }
        }
        if ( this.hunger > 50 ) {
            const evt = { type: "state-change", source: "human", state: "hungry" };
            world.emitEvent(evt);
        }
        else {
            const evt = { type: "state-change", source: "human", state: "full" };
            world.emitEvent(evt);
        }

    }
} 