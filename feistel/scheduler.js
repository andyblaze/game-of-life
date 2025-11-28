class AnimationFactory {
    constructor() {
        this.registry = {};
    }

    register(type, ctor) {
        this.registry[type] = ctor;
    }

    create(type, data) {
        const Ctor = this.registry[type];
        if (!Ctor) throw new Error(`Unknown animation type: ${type}`);
        return new Ctor(data);
    }
}
const factory = new AnimationFactory();
factory.register("slideIn", SlideIn);

export default class Scheduler {
    constructor(events) {
        console.log(events);
        this.steps = [
            0
        ];
        this.running = [];
    }
    triggersAt(seconds) {
        return (this.steps.indexOf(seconds) > -1 && this.running.indexOf(seconds) === -1);
    }
    launch(seconds) {
        this.running.push(seconds);
    }
}