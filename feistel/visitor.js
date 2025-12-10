import { isString, isArray, isObject } from "./functions.js";

export default class FeistelVisitor {
    constructor() {
        this.events = {"encrypt": [], "decrypt":[]};
    }
    collect(direction, type, data) {
        let d;
        if ( isString(data) )
            d = {"string": data, "array": data.split("")};
        else if ( isArray(data) && ! isObject(data[0]) ) 
            d = {"string": data.join(""), "array": data};
        else d = data;
        this.events[direction].push({"type": type, "data": d});
    }
    buildData() {
        let result = {"encrypt": [], "decrypt":[]};
        for ( let e of this.events.encrypt) {
            result.encrypt.push(e);
        }
        for ( let e of this.events.decrypt) {
            result.decrypt.push(e);
        }
        return result;
    }
    getDataStr() {
        const result = this.buildData();
        return JSON.stringify(result);
    }
    getData() { 
        return this.buildData();
   }
}