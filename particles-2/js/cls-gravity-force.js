export default class GravityForce {
    static type = "gravity";

    constructor(cfg) {
        this.cfg = cfg;
        this.baseStrength = 0.02; // tweak this
    }

    apply(particles) {
        const strength = this.baseStrength * this.cfg.gravity; 
        particles.forEach(p => {
            p.vel.y += strength; 
        });
    }
}
