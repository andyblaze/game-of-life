import Tickable from "../base-classes/tickable.js";

export default class Robot extends Tickable {
    constructor() {
        super();
        this.power = 80;
        this.active = true;
        this.powerUsage = 0.8 + Math.random() * 0.4;
    }
    consume(world) {
        this.power -= this.powerUsage;
        if  ( this.power < 10 ) this.active = false;
        if ( false === this.active ) {
            const evt = { type: "state-change", source: "robot", state: "inactive" };
            world.emitEvent(evt);
            this.power += world.consume({ type: "power", amount: 5 });
            this.active = (this.power > 10);
            //return;
        }
        
        if ( this.power < 50 ) {
            const pwr = world.consume({ type: "power", amount: 1 });   
            if ( pwr )
                this.power += 1;        
        }
    }
}