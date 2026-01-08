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
            this.onSpinning().catch(console.error);
        });

        this.engine.on("state:enter:EVALUATING", () => {
            this.onEvaluating().catch(console.error);
        });

        this.engine.on("state:enter:PAYOUT", () => {
            this.onPayout().catch(console.error);
        });
    }

    async onSpinning() { 
        this.result = this.machine.spin();
        await this.ui.animateSpin(this.result.indices);//, () => {
            this.engine.dispatch("SPIN_COMPLETE", this.result); 
        //});
    }

    async onEvaluating() { 
        this.payout = this.evaluator.evaluate(this.result.symbols); 
        this.engine.dispatch("EVALUATE_COMPLETE", this.payout); 
    }

    async onPayout() {
       await this.ui.animatePayout(this.payout);//, () => {
            this.engine.dispatch("PAYOUT_COMPLETE");
       // });
    }

    reset() {
        this.machine.reset?.();
        this.ui.reset?.();
    }
}
