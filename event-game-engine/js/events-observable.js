
export default class EventsObservable {
    constructor() {
        this.observers = [];
    }
    add(o) {
        this.observers.push(o);
    }
    notify(dt) {
        for ( let o of this.observers )
            o.update(dt);
    }
}