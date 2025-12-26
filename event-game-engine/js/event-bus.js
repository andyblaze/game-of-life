export default class EventBus {
    constructor() {
        this.listeners = {};
    }
    on(type, fn) {
        (this.listeners[type] ||= []).push(fn);
    }
    emit(type, data) {
        for ( const fn of this.listeners[type] || [] ) {
            fn(data);
        }
    }
}
