export default class SteeringSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    update(dt) {
        // staging steering: constant westward drift
        const vx = -0.7;
        let vy = 0;
        this.eventBus.emit("player:steer", { vx, vy });
    }
}