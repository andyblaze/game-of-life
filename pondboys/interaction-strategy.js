import { clamp } from "./functions.js";

class InteractionStrategy {
    interact(self, other) { } 
}

class PredatorInteraction extends InteractionStrategy {
    interact(self, other) {
        if (other.isPrey()) {
            const stolen = Math.min(other.energy * 0.3, 2);
            self.energy = clamp(self.energy + stolen, 0, self.dna.energyCap);
            other.energy = clamp(other.energy - stolen, 0, other.dna.energyCap);
        }
    }
}

export class VampireInteraction extends PredatorInteraction {}
export class TrapperInteraction extends InteractionStrategy {
    interact(self, other) {
        const state = self.dna.state;
        if ( state.mode === "trapping" ) {
            const prey = state.captive;
            // prey vanished or dead → release
            if ( ! prey || prey.energy < 10 ) {
                state.mode = "idle";
                state.captive = null;
                //self.archetype.propel(self);
                return;
            }
            // pin prey to trapper
            prey.x = self.x;
            prey.y = self.y;
            prey.vx = self.vx;
            prey.vy = self.vy;   
            // siphon energy
            const stolen = Math.min(other.energy * 0.8, 2);
            self.energy = clamp(self.energy + stolen, 0, self.dna.energyCap);
            other.energy = clamp(other.energy - stolen, 0, other.dna.energyCap);
            return;            
        }

        // idle → check if we can capture prey
        if (other.isPrey() && other.radius < self.radius * 0.6) {
            state.mode = "trapping";
            state.captive = other;
            other.radius = 3;
        }
    }
}

export class PreyInteraction extends InteractionStrategy {
    interact(self, other) {
        // could add evasion, energy loss when attacked, etc.
    }
}

