
class EffectState {
    static enter(context, ...args) {
        if ( this.runEnter ) this.runEnter(context, ...args);
    }
    static update(context, drop, duration) {
        this.runUpdate(context, drop, duration);
    }
    static exit(context) {
        if ( this.runExit ) this.runExit(context);
    }
}
export class EffectIdleState extends EffectState {

}
export class EffectActiveState extends EffectState {

}

export class StateMachine {
    static run(drop, duration) {
        this.state.update(this, drop, duration);
    }
    static transition(newState, ...args) {
        this.state.exit(this);
        this.state = newState;
        this.state.enter(this, ...args);
    }
}