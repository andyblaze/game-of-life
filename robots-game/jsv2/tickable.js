export default class Tickable {
    constructor() {
        this.result = {type: "", amount: 0};
    }
    consume(world) {}
    produce(world) {}
    finalise(world) {}
    ontick(world) {
        this.consume(world);
        this.produce(world);
        this.finalise(world);
    }
}
