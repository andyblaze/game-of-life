export default class Player {
    constructor(eventBus, initial = {}) {
        this.data = { "prevX": 0, "prevY": 0, "x": 0, "y": 0, "inTown":null };
        this.eventBus = eventBus;
        this.data.x = initial.x ?? 0;
        this.data.y = initial.y ?? 0; 
        this.setPosition(this.data.x,  this.data.y)
    }
    // Set a new position in map coordinates
    setPosition(x, y) {
        this.data.x = x;
        this.data.y = y; 
        this.eventBus.emit("player:moved", this.getPosition());
        
    }
    update(dt) {
        // nothing for now, but will be used when player is on a journey
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
