import { hexToHSLA } from "./functions.js";
export default class TypeConverter {
    apply(type, val) {
        if (typeof this[type] === "function") {
            return this[type](val);
        }
        else {
            console.error("TypeConverter.apply(type, val) ", type, " is not a method.");
        }
    }
    str(val) {
        return val;
    }
    float(val) {
        return parseFloat(val);
    }
    invert(val) {
        return 0.5 - parseFloat(val);
    }
    int(val) {
        return parseInt(val);
    }
    hex(val) {
        return val;
    }
    hsla(val) {
        return hexToHSLA(val);
    }
}
