export default class SteeringSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    update(dt) {
        // staging steering: constant westward drift
        const vx = -0.7;
        let vy = Math.random() - 0.8; if (Math.random() < 0.5) vy = -vy;
        this.eventBus.emit("player:steer", { vx, vy });
    }
}