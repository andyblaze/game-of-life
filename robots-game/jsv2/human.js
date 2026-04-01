import Tickable from "./tickable.js";

export default class Human extends Tickable {
    constructor() {
        super();
        this.hunger = 0;
        this.morale = 50;
        this.hungerRate = 0.8 + Math.random() * 0.4;
    }

    consume(world) {
        this.hunger += this.hungerRate;

        if (this.hunger > 50) {
            const eaten = world.consume({ type: "bread", amount: 1 });
            console.log("bread", eaten);

            if (eaten) {
                this.hunger -= 10;
                this.morale += 1;
            } else {
                this.morale -= 1;
            }
        }
    }
}