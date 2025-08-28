import { distance } from "./functions.js";

export default class FoodHandler {
    constructor(global) {
        this.global = global; // so you know pond dimensions, foodEnergy, etc.
        this.food = [];
    }

    update(critters) {
        for (let i = critters.length - 1; i >= 0; i--) {
            const c = critters[i];
            if (c.type === 'predator') continue;

            for (let j = this.food.length - 1; j >= 0; j--) {
                const f = this.food[j];
                const { dist } = distance(c, f);
                if (dist < c.radius + f.radius) {
                    c.eat(this.global.foodEnergy);
                    this.food.splice(j, 1);
                    this.spawnFood(); // optional respawn
                }
            }
        }
        return this.food;
    }

    spawnFood(n=1) {
        for (let i = 0; i < n; i++) {
            this.food.push({
                x: Math.random() * this.global.width,
                y: Math.random() * this.global.height,
                radius: 3,
                color: "rgba(204, 102, 255, 0.6)"
            });
        }
    }
}