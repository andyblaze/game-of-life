import Tickable from "../base-classes/tickable.js";

export default class Robot extends Tickable {
    constructor(actor) {
        super();
        this.actor = actor;
        this.actor.color = "blue";
        this.power = 80;
        this.prevPower = this.power;
        this.powerThreshold = 20;
        this.active = true;
        this.powerUsage = 0.8 + Math.random() * 0.4;
    }
    setActive(a) {
        this.active = a;
        const s = (true === this.active ? "active" : "inactive");
        const evt = { type: "state-change", source: "robot", state: s };
        world.emitEvent(evt); 
    }
    consume(world) {
        this.prevPower = this.power;
        this.power -= this.powerUsage;
        if  ( this.power < this.powerThreshold ) {
            this.setActive(false);
            this.power += world.consume({ type: "power", amount: 5 });
            this.active = (this.power > this.powerThreshold);
            //return;
        }
        
        if ( this.power < 50 ) {
            const pwr = world.consume({ type: "power", amount: 1 });   
            if ( pwr )
                this.power += 1;        
        }
    }
}