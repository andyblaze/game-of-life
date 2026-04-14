export default class Tile {
    constructor(row, col, size) {
        this.row = row;
        this.col = col;
        this.size = size;
        this.type = "";
        this.walkable = true;
        this.building = null;
    }
    isUsed() {
        return this.type.length > 0;
    }
    isWalkable() {
        return this.walkable;
    }
    setType(t) {
        this.type = t;
        this.walkable = (t !== "pond");
    }
    getType() {
        return this.type;
    }
    setBuilding(b) {
        this.building = b;
        this.walkable = false;
    }
    getBuilding() {
        return this.building;
    }
    isFree() {
        return (this.building === null);
    }
    isOccupied() {
        return (this.building !== null);
    }
}