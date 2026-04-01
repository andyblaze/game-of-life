import Tickable from "./tickable.js";

class Robot extends Tickable {
    constructor() {
        super();
        this.power = 100;
        this.active = true;
        this.powerUsage = 0.8 + Math.random() * 0.4;
    }
    consume(world) {
        if  ( this.power < 10 ) this.active = false;
        if ( false === this.active ) return;
        this.power -= this.powerUsage;
        if ( this.power < 50 ) {
            const pwr = world.consume({ type: "power", amount: 1 });
            console.log("power", pwr);    
            if ( pwr )
                this.power += 1;        
        }
    }
}