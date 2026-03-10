import RotationForce from "./rotation-force.js";
import PinchForce from "./pinch-force.js";
import BendForce from "./bend-force.js";
import TwistForce from "./twist-force.js";
import ShearForce from "./shear-force.js";
import SpiralForce from "./spiral-force.js";

export default class Forces { 
    constructor(cfg) {
        this.cfg = cfg;
        this.forces = [
            new RotationForce(cfg),
            new PinchForce(cfg),
            new BendForce(cfg),
            new TwistForce(cfg),
            new ShearForce(cfg),
            new SpiralForce(cfg)
        ];
    }
    update(t, pos) {
        for ( const f of this.forces ) {
            f.update(t, pos);
        }
    }
    reset() {
        for ( const f of this.forces ) {
            f.reset(this.cfg);
        }
    }
}