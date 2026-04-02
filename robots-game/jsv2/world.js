export default class World {
    constructor() {
        this.observers = [];
        this.items = {};
        this.stocks = {};
    }
    addObserver(o) {
        this.observers.push(o);
    }
    add(item) {
        this.items[item.product] = item;
        this.stocks[item.product] = 0;
    }
    populate(type, pop) {
        this[type] = pop;
    }
    getHumanCount() {
        return this.humans.getCount();
    }
    getMorale() {
        return this.humans.getMorale();
    }
    tick() {
        for ( const [key, item] of Object.entries(this.items) ) {
            item.tick(this);
        }
        this.humans.tick(this);
        this.robots.tick(this);
        this.notify();
    }
    stockUnknown(type) {
        const ok = !(type in this.stocks);
        if ( true === ok ) {
            console.error(type + " is not in stocks. Typo ?");
        }
        return ok;
    }
    deposit(d) {
        if ( this.stockUnknown(d.type) ) return;
        this.stocks[d.type] += d.amount;
    }
    hasResource(r) {
        if ( this.stockUnknown(r.type) ) return false;
        return this.stocks[r.type] >= r.amount;
    }
    consume(c) {
        if ( this.stockUnknown(c.type) ) return 0;
        if ( this.stocks[c.type] - c.amount < 0  ) return 0;
        this.stocks[c.type] -= c.amount;
        return c.amount;
        
    }
    notify() {
        let data = [];
        for ( const [key, item] of Object.entries(this.stocks ) ) {
            data.push({ type: key, output: item });
        }
        data.push({ type: "humans", output: this.humans.getCount()});
        data.push({ type: "robots", output: this.robots.getCount()});
        data.push({ type: "morale", output: this.humans.getMorale()});
        for ( const o of this.observers ) {
            o.update(data);
        }
    }
}