import GameItem from "./base-classes/game-item.js";
import Human from "./units/human.js";
import Robot from "./units/robot.js";

class Population extends GameItem {
    constructor(product) {
        super(product);
    }
    getActors() {
        return this.pop.map(a => a.actor);
    }
    render(ctx, timers) {
        for ( const a of this.getActors() )
            a.render(ctx, timers);
    }
    produce(world) {}
    finalise(world) {}
    tick(world) {
        const shuffled = [...this.pop].sort(() => Math.random() - 0.5);
        for ( const item of shuffled ) {
            item.ontick(world);
        }
    }
    getCount() {
        return this.pop.length;
    }
}

export class HumanPopulation extends Population {
    constructor(n, actors) {
        super({ product: "" });
        this.pop = actors.map(actor => new Human(actor));
    }
    getMorale() {
        return this.pop.reduce((a, h) => a + h.morale, 0) / this.pop.length;
    }
}

export class RobotPopulation extends Population {
    constructor(n, actors) {
        super({ product: "" });
        this.pop = actors.map(actor => new Robot(actor));
    }
}