import GameItem from "./game-item.js";

export default class ObjectFactory {
    constructor(r) {
        this.registry = r;
    }
    create(type) {
        const Ctor = this.registry[type];
        if ( !Ctor ) throw new Error(`ObjectFactory.create(type) : Unknown type: ${type} Typo ?`);
        return new GameItem(new Ctor(type));
    }
}