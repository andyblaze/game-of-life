export default class SlotController {
    constructor(engine, machine, ui, evaluator) {
        this.engine = engine;
        this.machine = machine;
        this.ui = ui;
        this.evaluator = evaluator;
        this.result = [];
        this.payout = {};

        this.bindEvents();
    }

    bindEvents() {
        this.engine.on("state:enter:SPINNING", () => {
            this.onSpinning();
        });

        this.engine.on("state:enter:EVALUATING", () => {
            this.onEvaluating();
        });

        this.engine.on("state:enter:PAYOUT", () => {
            this.onPayout();
        });
    }

    async onSpinning() { 
        this.result = this.machine.spin();
        await this.ui.animateSpin(this.result, () => {
            this.engine.dispatch("SPIN_COMPLETE", this.result); 
        });
    }

    async onEvaluating() { 
        this.payout = this.evaluator.evaluate(this.result); 
        this.engine.dispatch("EVALUATE_COMPLETE", this.payout); 
    }

    async onPayout() {
        await this.ui.animatePayout(this.payout, () => {
            this.engine.dispatch("PAYOUT_COMPLETE");
        });
    }

    reset() {
        this.machine.reset?.();
        this.ui.reset?.();
    }
}
