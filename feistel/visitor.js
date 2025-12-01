import { isString, isArray } from "./functions.js";

export default class FeistelVisitor {
    constructor() {
        this.events = {"encrypt": [], "decrypt":[]};
        this.t = 0;    // time counter
    }
    collect(direction, type, data) {
        let d;
        if ( isString(data) )
            d = {"string": data, "array": data.split("")};
        else if ( isArray(data) ) 
            d = {"string": data.join(""), "array": data};
        else d = data;
        this.events[direction].push({time: this.t, "type": type, "data": d});
        this.t++;
        //console.log(this.events.encrypt.length);
    }
    getDataStr() {
        let result = [];//"<b>Encrypt</b><br>"];
        for ( const [idx, e] of this.events.encrypt.entries()) {
            //e.time = idx;
            result.push(JSON.stringify(e));
        }
        //result.push("<br><b>Decrypt</b><br>");
        /*for ( const [idx, e] of this.events.decrypt.entries()) {
            e.time = idx;
            result.push(JSON.stringify(e));
        }*/
        //console.log(result);
        return result;
            //console.log(JSON.parse(JSON.stringify(d)));
    }
    getData() { //console.log(this.events.decrypt.length);
        
        let result = [];//"<b>Encrypt</b><br>"];
        for ( const [idx, e] of this.events.encrypt.entries()) {
            e.time = idx;
            result.push(e);
        }
        //result.push("<br><b>Decrypt</b><br>");
        /*for ( const [idx, e] of this.events.decrypt.entries()) {
            e.time = idx;
            result.push(JSON.stringify(e));
        }*/
        //console.log(result.length);
        return result;
            //console.log(JSON.parse(JSON.stringify(d)));
    }
}