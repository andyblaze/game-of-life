export default class Processor {
    constructor(strategy, renderer) {
        this.strategy = strategy;
        this.renderer = renderer;
    }

    process(delta, rawData) { 
        const processed = this.strategy.transform(rawData.data);
        this.renderer.render(delta, processed);
    }
}