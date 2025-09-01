
class AuroraPropulsion {
    propel(aurora) {
        // if we want to add little jitters do it in here
        const a = aurora;
        const speed = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
        


        if (speed < a.global.isStationary) {
            // choose a random direction
            const angle = Math.random() * 2 * Math.PI;

            // apply it to velocity
            a.vx += Math.cos(angle) * a.global.propulsionKick;
            a.vy += Math.sin(angle) * a.global.propulsionKick;
        }
    }
}
export class Type1Propulsion extends AuroraPropulsion {}
export class Type2Propulsion extends AuroraPropulsion {}
export class Type3Propulsion extends AuroraPropulsion {}


