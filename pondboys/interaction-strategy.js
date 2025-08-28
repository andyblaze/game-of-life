import { clamp } from "./functions.js";

class InteractionStrategy {
    interact(self, other) { } 
}

export class PredatorInteraction extends InteractionStrategy {
    interact(self, other) {
        if (other.type === "prey") {
            const stolen = Math.min(other.energy * 0.3, 2);
            self.energy = clamp(self.energy + stolen, 0, self.dna.energyCap);
            other.energy = clamp(other.energy - stolen, 0, other.dna.energyCap);
        }
    }
}

export class PreyInteraction extends InteractionStrategy {
    interact(self, other) {
        // could add evasion, energy loss when attacked, etc.
    }
}

