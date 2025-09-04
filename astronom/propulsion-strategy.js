
class PlantPropulsion {
    propel(plant) {
        // if we want to add little jitters do it in here
        const p = plant;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);      

        if (speed < p.global.isStationary) {
            // choose a random direction
            const angle = Math.random() * 2 * Math.PI;

            // apply it to velocity
            p.vx += Math.cos(angle) * p.global.propulsionKick;
            p.vy += Math.sin(angle) * p.global.propulsionKick;
        }
    }
}
export class Type1Propulsion extends PlantPropulsion {}
export class Type2Propulsion extends PlantPropulsion {}
export class Type3Propulsion extends PlantPropulsion {}


