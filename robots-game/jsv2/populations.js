import GameItem from "./game-item.js";
import Human from "./human.js";
import Robot from "./robot.js";

export class HumanPopulation extends GameItem {
    constructor(n) {
        super({ product: "" });
        this.pop = Array.from({ length: n }, () => new Human());
    }
    produce(world) {}
    finalise(world) {}
    tick(world) {
        const shuffled = [...this.pop].sort(() => Math.random() - 0.5);
        for (const human of shuffled) {
            human.ontick(world);
        }
    }
    getMorale() {
        return this.pop.reduce((a, h) => a + h.morale, 0) / this.pop.length;
    }
    getCount() {
        return this.pop.length;
    }
}

export class RobotPopulation extends GameItem {
    constructor(n) {
        super({ product: "" });
        this.pop = Array.from({ length: n }, () => new Robot());
    }
    getCount() {
        return this.pop.length;
    }
    produce(world) {}
    finalise(world) {}
    tick(world) {
        const shuffled = [...this.pop].sort(() => Math.random() - 0.5);
        for (const robot of shuffled) {
            robot.ontick(world);
        }
        console.log(this.pop.reduce((a, r) => a + r.power, 0) / this.pop.length);
    }
}