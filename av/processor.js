export default class Processor {
    constructor(strategy) {
        this.strategy = strategy;
        this.renderer = renderer;
    }
    process(rawData) { 
        return this.strategy.transform(rawData);
    }
}