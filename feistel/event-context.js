
export default class EventContext {
    static events = [];
    static setEvents(es) {
        this.events = es;
    }
    static getEvents(direction) {
        return this.events[direction];
    }
    static getEvent(direction, index) {
        return this.events[direction][index];
    }
}