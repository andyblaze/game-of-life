import { lerpColor } from "./functions.js";

class CritterLifespan {
    update(critter) {
        const c = critter;
        c.age++;
        if (c.age >= c.lifespan) {
            c.energy -= 0.5;

            const agingDuration = 120; // frames to tint
            const fadeDuration  = 120; // frames to fade

            const ageOver = c.age - c.lifespan;

            const healthyColor = c.dna.healthyColor;     // [r,g,b,a]
            const agingColor   = [0, 204, 0, 0.9];          // target tint

            if (ageOver <= agingDuration) {
                // Phase 1: lerp healthy → old color
                const t = ageOver / agingDuration;
                c.dna.color = lerpColor(healthyColor, agingColor, t);
            } else {
                // Phase 2: fade alpha only
                const fadeT = Math.min((ageOver - agingDuration) / fadeDuration, 1);
                const [r,g,b,a] = agingColor;
                c.dna.color = [r, g, b, a * (1 - fadeT)];
            }
        }
        else {
            // grow based on energy surplus or a fixed rate
            const growthRate = 0.02 * (c.energy / c.dna.energyCap);
            c.radius = Math.min(c.radius + growthRate, c.dna.maxRadius);
        }
    }
}
export class PreyLifespan extends CritterLifespan {}
export class PredatorLifespan extends CritterLifespan {}
