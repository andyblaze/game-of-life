export default class Processor {
    constructor(strategy) {
        this.strategy = strategy;
    }
    process(rawData) { 
        return this.strategy.transform(rawData);
    }
}