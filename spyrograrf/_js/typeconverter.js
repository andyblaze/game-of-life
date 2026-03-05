import { hexToHSLA } from "./functions.js";
export default class TypeConverter {
    apply(type, ctrl, val) {
        if (typeof this[type] === "function") {
            return this[type](ctrl, val);
        }
        else {
            console.error("TypeConverter.apply(type, val) ", type, " is not a method.");
        }
    }
    str(ctrl, val) {
        return val;
    }
    float(ctrl, val) {
        return parseFloat(val);
    }
    bool(ctrl, val) {
        return !!ctrl.checked;
    }
    int(ctrl, val) {
        return parseInt(val);
    }
    hex(ctrl, val) {
        return val;
    }
    hsla(ctrl, val) {
        return hexToHSLA(val);
    }
}
