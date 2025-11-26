
export default class FeistelVisitor {
    constructor() {
        this.events = {"encrypt": [], "decrypt":[]};
        //this.t = 0;    // time counter
    }
    collect(direction, type, data) {
        this.events[direction].push({time: 0, "type": type, "data": data});
        //this.t++;
    }
    show() { console.log(this.events.decrypt.length);
        let result = [];
        for ( const [idx, e] of this.events.encrypt.entries()) {
            e.time = idx;
            result.push(JSON.stringify(e));
        }
        return result.join("<br>");
            //console.log(JSON.parse(JSON.stringify(d)));
    }
}