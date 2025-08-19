
class EffectState {
    static onEnter(context, ...args) {
        if ( this.enter ) this.enter(context, ...args);
    }
    static onUpdate(context, drop, duration) {
        this.update(context, drop, duration);
    }
    static onExit(context) {
        if ( this.exit ) this.exit(context);
    }
}
export class EffectIdleState extends EffectState {

}
export class EffectActiveState extends EffectState {

}

export class StateMachine {
    static run(drop, duration) {
        this.state.onUpdate(this, drop, duration);
    }
    static transition(newState, ...args) {
        this.state.onExit(this);
        this.state = newState;
        this.state.onEnter(this, ...args);
    }
}