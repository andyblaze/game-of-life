export default class SlotController {
    constructor(engine, machine, ui) {
        this.engine = engine;
        this.machine = machine;
        this.ui = ui;

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

    onSpinning() {
        const result = this.machine.spin();
        this.ui.animateSpin(result, () => {
            this.engine.dispatch("SPIN_COMPLETE", result);
        });
    }

    onEvaluating() {
        this.engine.dispatch("EVALUATE_COMPLETE");
    }

    onPayout() {
        this.ui.animatePayout(() => {
            this.engine.dispatch("PAYOUT_COMPLETE");
        });
    }

    reset() {
        this.machine.reset?.();
        this.ui.reset?.();
    }
}
