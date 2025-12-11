
export default class LayoutRegistry {
    static data = {};
    static register(key, val) {
        this.data[key] = val;
    }
    static layoutFor(key) {
        return this.data[key];
    }
}
