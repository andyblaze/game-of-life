export default class GravityForce {
    static type = "gravity";

    constructor(cfg) {
        this.strength = 0.02; // tweak this
    }

    apply(particles) {
        particles.forEach(p => {
            p.vel.y += this.strength; // push downward
        });
    }
}
