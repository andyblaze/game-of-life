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
    tick() {
        for ( const [key, item] of Object.entries(this.items) )
            item.tick(this);
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
        for ( const [key, item] of Object.entries(this.stocks ) )
            data.push({ type: key, output: item });
        for ( const o of this.observers )
            o.update(data);
    }
}