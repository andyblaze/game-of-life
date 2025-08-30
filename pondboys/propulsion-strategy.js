
class CritterPropulsion {
    propel(critter) {
        const c = critter;
        // compute current speed
        const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy);

        // threshold below which we consider the critter "stationary"
        //const threshold = 0.6;

        if (speed < c.global.isStationary && c.energy > c.dna.propulsionThreshold) {
            // choose a random direction
            const angle = Math.random() * 2 * Math.PI;

            // choose a small propulsion magnitude
            //const propulsion = 0.5; // tweak for how strong the "kick" is

            // apply it to velocity
            c.vx += Math.cos(angle) * c.global.propulsionKick;
            c.vy += Math.sin(angle) * c.global.propulsionKick;
            c.energy -= c.dna.propulsionCost;
        }
    }
}
export class PreyPropulsion extends CritterPropulsion {}
export class VampirePropulsion extends CritterPropulsion {}
export class BasherPropulsion extends CritterPropulsion {}

