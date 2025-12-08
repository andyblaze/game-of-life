import Underliner from "./underliner.js";
import TextRenderer from "./textrenderer.js";
import Mediator from "./mediator.js";
import EventContext from "./event-context.js";

export default class TransformMediator extends Mediator {
    static type = "ttMediator";
    constructor(cnvs, data, cfg) {
        super(cnvs);
        for ( let a of cfg.actors ) {
            Object.assign(a.config, cfg);
            a.config.type = a.eventId;
            this[a.config.type] = this.animationFactory.create(
                a.type, 
                EventContext.byId(cfg.direction, a.eventId),
                a.config
            );
        }
        // bind the callback so `this` stays correct
        this.handlePlaintext = this.handlePlaintext.bind(this);
        this.handleAlphabet = this.handleAlphabet.bind(this);
        this.handleIndices = this.handleIndices.bind(this);
        // register callback with the underliner
        this.plaintext.onUnderline = this.handlePlaintext;
        this.alphabet.onUnderline = this.handleAlphabet;
        this.indices.onUnderline = this.handleIndices;
    }
    isComplete() {
        this.done = (this.plaintext.isComplete()
            && this.alphabet.isComplete()
            && this.indices.isComplete()
            && this.transformed_plaintext.isComplete());
    }
    handlePlaintext(token, charIndex) { 
        this.alphabet.underlineAt(token);
    }
    handleAlphabet(token, charIndex) { 
        this.indices.underlineAt(token, charIndex);
    }
    handleIndices(token, charIndex) { 
        this.transformed_plaintext.nextCharacter();
    }
    // animation frame driver
    run(dt, elapsedTime) {
        if ( this.isComplete() ) {
            this.onComplete();
            return
        }
        this.plaintext.run(dt, elapsedTime);
        this.alphabet.tick(dt);
        this.indices.tick(dt);
        this.transformed_plaintext.draw();
    }
}