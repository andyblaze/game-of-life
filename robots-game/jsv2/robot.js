import Tickable from "./tickable.js";

export default class Robot extends Tickable {
    constructor() {
        super();
        this.power = 60;
        this.active = true;
        this.powerUsage = 0.8 + Math.random() * 0.4;
    }
    consume(world) {
        this.power -= this.powerUsage;
        if  ( this.power < 10 ) this.active = false;
        if ( false === this.active ) {
            this.power += world.consume({ type: "power", amount: 5 });
            this.active = (this.power > 10);
            console.log(this.power, this.active);
            //return;
        }
        
        if ( this.power < 50 ) {
            const pwr = world.consume({ type: "power", amount: 1 });
            console.log("power", pwr);    
            if ( pwr )
                this.power += 1;        
        }
    }
}