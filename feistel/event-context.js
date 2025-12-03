
export default class EventContext {
    static events = [];
    static eventMap = {
        "encrypt": {},
        "decrypt": {}
    };
    static setEvents(es) {
        this.events = es;
        this.events["encrypt"].forEach((evt, idx) => {
            const dir = "encrypt"; // "encrypt" or "decrypt"
            this.eventMap[dir][evt.type] = idx;  // store numeric index
        });
    }
    static getEvents(direction) {
        return this.events[direction];
    }
    static getEvent(direction, index) {
        return this.events[direction][index];
    }
    static byId(direction, type) {
        const idx = this.eventMap[direction][type]; //console.log(idx);
        if (idx === undefined) return null;  // or throw error
        return this.events[direction][idx];
    }
}