import GameItem from "./game-item.js";

export default class ObjectFactory {
    constructor(r, b) {
        this.registry = r;
        this.balance = b;
    }
    create(type) {
        const Ctor = this.registry[type];
        if ( !Ctor ) throw new Error(`ObjectFactory.create(type) : Unknown type: ${type} Typo ?`);
        const baseOutput = this.balance.outputs[type];
        return new GameItem(new Ctor(type, baseOutput));
    }
}