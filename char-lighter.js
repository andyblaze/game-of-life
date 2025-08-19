import { mt_rand } from "./functions.js";
import { StateMachine, EffectIdleState, EffectActiveState } from "./state-machine.js";

class IdleState extends EffectIdleState {
    static runUpdate(context, drop, duration) {
        if ( Math.random() < 0.5 && drop && !drop.isOffscreen() ) {
            context.transition(ActiveState, drop, duration);
        }
    }
}
class ActiveState extends EffectActiveState {
    static runEnter(context, drop, duration) {
        context.drop = drop;
        context.flashFramesLeft = duration * duration; // * duration is 60 if we're at 60fps.  tweak if needed
        context.flashIndex = mt_rand(3, drop.chars.length - 1);
        context.originalAlpha = drop.alphas[context.flashIndex];
        drop.alphas[context.flashIndex] = 1;
    }
    static runUpdate(context) {
        if ( !context.drop || context.drop.isOffscreen() ) {
            context.transition(IdleState);
            return;
        }
        context.flashFramesLeft--;
        if (context.flashFramesLeft <= 0) { 
            context.transition(IdleState);
        } else {
            context.drop.alphas[context.flashIndex] = 1;
        }
    }
    static runExit(context) {
        if ( context.drop ) {
            context.drop.alphas[context.flashIndex] = context.originalAlpha;
        }
        context.drop = null;
        context.flashIndex = 0;
        context.originalAlpha = 0;
        context.flashFramesLeft = 0;
    }
}
export default class charLighter extends StateMachine {
    static state = IdleState;
    // Spotlight effect states
    static flashIndex = 0;     // index of the char being lit
    static flashFramesLeft = 0;   // countdown until it stops  
    static originalAlpha = 0;
    static drop = null;
    //static nums = {stt:0, run:0, stp:0, rst:0}; unused for now, might be useful for debuggering ;)
}