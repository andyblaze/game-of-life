
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
            this.eventMap[dir][evt.type] = idx;  
        });
    }
    static getEvents(direction) {
        return this.events[direction];
    }
    static getEvent(direction, index) {
        return this.events[direction][index];
    }
    static byId(direction, type) { 
        const idx = this.eventMap[direction][type]; 
        if (idx === undefined) return null;  
        return this.events[direction][idx];
    }
}