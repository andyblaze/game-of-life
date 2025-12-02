
export default class LayoutRegistry {
    static data = {};
    static register(key, val) {
        this.data[key] = val;
    }
    layoutFor(key) {
        return this.data[key];
    }
}