import { clamp } from "./functions.js";

export default class Player {
    constructor(eventBus, initial = {}) {
        this.data = { "prevX": 0, "prevY": 0, "x": 0, "y": 0, "inTown":null };
        this.eventBus = eventBus;
        this.data.x = initial.x ?? 0;
        this.data.y = initial.y ?? 0; 
        this.velocity = { "x": 0, "y": 0 };
        this.setPosition(this.data.x,  this.data.y);
        this.eventBus.on("player:steered", (data) => this.applySteering(data));
    }
    applySteering(data) { 
        const { vx, vy} = { ...data };
        this.velocity.x = vx;
        this.velocity.y = vy;
        const newX = this.data.x + this.velocity.x;
        const newY = this.data.y + this.velocity.y;
        this.setPosition(newX, newY);
    }
    // Set a new position in map coordinates
    setPosition(x, y) {
        this.data.x = x;
        this.data.y = y; 
        this.eventBus.emit("player:moving", this.getPosition());
        
    }
    update(dt) {
        if ( this.velocity.x === 0 && this.velocity.y === 0 ) return;
        const speed = 0.03; // map units per ms (tweak freely)

        const newX = this.data.x + this.velocity.x * dt;
        const newY = this.data.y + this.velocity.y * dt;
        //const newX = clamp(this.data.x - speed * dt, 0, 573);
        //const newY = this.data.y;
        //this.setPosition(newX, newY);
    }
    // Optionally, mark which town the player is in
    setTown(townId) {
        if ( this.data.inTown !== townId ) {
            const prevTown = this.data.inTown;
            this.data.inTown = townId;
            this.eventBus.emit("player:townChanged", { prevTown, townId });
        }
    }
    // Simple getter for convenience
    getPosition() {
        return { ...this.data };
    }
}
