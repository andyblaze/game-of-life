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
    buildDirection(direction) {
        let result = [];
        for ( let e of this.events[direction])
            result.push(e);
        return result;
    }
    buildData() {
        let result = {"encrypt": [], "decrypt":[]};
        result.encrypt = this.buildDirection("encrypt");
        result.decrypt = this.buildDirection("decrypt");
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