import Underliner from "./underliner.js";
import TextRenderer from "./textrenderer.js";
import Animation from "./animation.js";

export default class TransformMediator extends Animation {
    static type = "ttMediator";
    constructor(cnvs) {
        super(cnvs);
        this.underliner = new Underliner(cnvs, null, {"duration": 300, "linger": 200});
        this.textRenderer = new TextRenderer(cnvs, null, {"x":40, "y": 200});

        // bind the callback so `this` stays correct
        this.handleUnderline = this.handleUnderline.bind(this);

        // register callback with the underliner
        this.underliner.onUnderline = this.handleUnderline;

        this.dummyCounter = 0; // for generating dummy tokens
    }
    handleUnderline({ charIndex }) {
        // Append a new dummy token every time a char is underlined
        this.textRenderer.append(this.dummyCounter++);
    }
    // animation frame driver
    run(dt, elapsedTime) {
        this.underliner.run(dt, elapsedTime);
        this.textRenderer.draw();
    }
}