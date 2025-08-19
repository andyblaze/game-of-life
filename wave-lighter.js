import { mt_rand } from "./functions.js";
import { StateMachine, EffectIdleState, EffectActiveState } from "./state-machine.js";

class IdleState extends EffectIdleState {
    static runUpdate(context, drop, duration) {
        // e.g. 5% chance per frame to start
        if (Math.random() < 1 && drop && !drop.isOffscreen()) {
            if ( drop.alphas.length > 8 )
                context.transition(ActiveState, drop, duration);
        }
    }
}

class ActiveState extends EffectActiveState {
    static runEnter(context, drop, duration) {
        context.drop = drop;
        context.duration = duration * 90;
        context.flashIndex = 0;               // start at head
        context.framesPerChar = duration * 60;     // how long each char lights
        context.framesLeft = context.framesPerChar;
        context.originalAlphas = [...drop.alphas]; // keep originals
        drop.alphas[0] = 1;                   // light the first char
    }

    static runUpdate(context) {
        if (!context.drop || context.drop.isOffscreen()) {
            context.transition(IdleState);
            return;
        }

        context.framesLeft--;

        if (context.framesLeft <= 0) {
            // restore old alpha for previous char
            context.drop.alphas[context.flashIndex] = context.originalAlphas[context.flashIndex];

            context.flashIndex++;
            if (context.flashIndex >= context.drop.chars.length) {
                context.transition(IdleState);
                return;
            }

            // move to next char
            context.framesLeft = context.framesPerChar;
            context.drop.alphas[context.flashIndex] = 1;
        }
    }

    static runExit(context) {
        if (context.drop) {
            // restore any char that might still be lit
            context.drop.alphas[context.flashIndex] = context.originalAlphas[context.flashIndex];
        }
        context.drop = null;
        context.flashIndex = 0;
        context.framesLeft = 0;
        context.originalAlphas = [];
    }
}

export default class waveLighter extends StateMachine {
    static state = IdleState;
    static drop = null;
    static flashIndex = 0;
    static framesLeft = 0;
    static framesPerChar = 0;
    static originalAlphas = [];
    static duration = 0;
}
