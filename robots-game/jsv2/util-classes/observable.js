export class Observable {
    constructor() {
        this.observers = [];
    }
    addObserver(o) {
        this.observers.push(o);
    }
    notify(data) {
        for ( const o of this.observers ) {
            o.update(data);
        }
    }
}