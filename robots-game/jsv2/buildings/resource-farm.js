import Tickable from "../base-classes/tickable.js";

export default class ResourceFarm extends Tickable {
    type = "";
    constructor(type) {
        super();
        this.type = type;
        this.result.type = type;
        this.product = this.type;
        this.output = { type: this.type, amount: 0 };
    }
    tick(world) {
        this.ontick(world);
        return this.result;
    }

}