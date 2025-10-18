export default class DataCollector {
    constructor(strategy) {
        this.strategy = strategy;
    }
    fetchData() {
        return this.strategy.fetchData();
    }
}