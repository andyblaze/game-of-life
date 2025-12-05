import Underliner from "./underliner.js";
import TextRenderer from "./textrenderer.js";
import Animation from "./animation.js";

export default class TransformMediator extends Animation {
    static type = "ttMediator";
    constructor(cnvs) {
        super(cnvs);
        this.plaintextUnderliner = new Underliner(cnvs, null, {"direction": "encrypt", "type": "plaintext", "stepTime": 300, "holdTime": 1500});
        this.alphabetUnderliner = new Underliner(cnvs, null, {"direction": "encrypt", "type": "alphabet", "stepTime": 500, "holdTime": 200});
        this.indicesUnderliner = new Underliner(cnvs, null, {"direction": "encrypt", "type": "indices", "stepTime": 500, "holdTime": 200});
        this.textRenderer = new TextRenderer(cnvs, null, {"direction": "encrypt", "type": "transformed_plaintext", "x":40, "y": 200});
        // bind the callback so `this` stays correct
        this.handlePlaintextUnderline = this.handlePlaintextUnderline.bind(this);
        this.handleAlphabetUnderline = this.handleAlphabetUnderline.bind(this);
        this.handleIndicesUnderline = this.handleIndicesUnderline.bind(this);
        // register callback with the underliner
        this.plaintextUnderliner.onUnderline = this.handlePlaintextUnderline;
        this.alphabetUnderliner.onUnderline = this.handleAlphabetUnderline;
        this.indicesUnderliner.onUnderline = this.handleIndicesUnderline;
    }
    handlePlaintextUnderline(token, charIndex) { 
        this.alphabetUnderliner.underlineAt(token);//, charIndex);
        // Append a new dummy token every time a char is underlined
        //this.textRenderer.append(this.dummyCounter++);
    }
    handleAlphabetUnderline(token, charIndex) { //console.log(token, charIndex);
        this.indicesUnderliner.underlineAt(token, charIndex);//, charIndex);
        // Append a new dummy token every time a char is underlined
        //this.textRenderer.append(this.dummyCounter++);
    }
    handleIndicesUnderline(token, charIndex) { 
        //this.indicesUnderliner.underlineAt(token, charIndex);//, charIndex);
        // Append a new dummy token every time a char is underlined
        this.textRenderer.nextCharacter();
    }
    // animation frame driver
    run(dt, elapsedTime) {
        this.plaintextUnderliner.run(dt, elapsedTime);
        this.textRenderer.draw();
    }
}