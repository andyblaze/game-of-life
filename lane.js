
export default class Lane {
    constructor(index) {
        this.index = index;
        this.drops = [];
    }

    addDrop(drop) {
        this.drops.push(drop);
    }

    removeOffScreen(canvasHeight, charHeight) {
        this.drops = this.drops.filter(drop => !drop.isOffScreen(canvasHeight, charHeight));
    }
}