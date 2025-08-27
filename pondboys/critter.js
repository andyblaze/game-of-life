import { clamp, mt_rand, lerpColor } from "./functions.js";
import DrawingStrategy from "./drawing-strategy.js";

export default class Critter {
    constructor(config, type="prey", newDNA=false) {
        this.global = config.global(); 
        this.type = type;
        this.dna = (newDNA === false ? config.item(type) : newDNA);
        this.initPosition(this.dna.maxSpeed);
        this.initProperties(this.dna);
    }
    initProperties(dna) {
        this.id = Math.random();
        this.age = 0;
        this.lifespan = mt_rand(dna.minLifespan * 3600, dna.maxLifespan * 3600);
        this.energy = dna.energyCap / 2; // start at half cap
        dna.healthyColor = [...dna.color];
        // assign color based on type
        //if (this.type === "predator") {
            this.color = "rgba(" + dna.color.join(",") + ")";//230, 25, 25, 0.5)"; // 0.5 alpha due to energy at 1/2 cap
        //} else {
        //    this.color = "rgba(46, 178, 178, 0.5)";
        //}
    }
    initPosition(maxSpeed) {
        this.x = mt_rand(0, this.global.width);
        this.y = mt_rand(0, this.global.height);
        this.vx = (Math.random() - 0.5) * maxSpeed;
        this.vy = (Math.random() - 0.5) * maxSpeed;
        this.radius = 4;
    }
    wraparoundEdges() {
        if (this.x < -this.radius) this.x += this.global.width + this.radius * 2;
        if (this.x > this.global.width + this.radius) this.x -= this.global.width + this.radius * 2;
        if (this.y < -this.radius) this.y += this.global.height + this.radius * 2;
        if (this.y > this.global.height + this.radius) this.y -= this.global.height + this.radius * 2;
    }
    eat(foodEnergy) {
        // Scale energy gain by age fraction (older = weaker digestion)
        const ageFactor = 1 - (this.age / this.lifespan); 
        const gained = foodEnergy * Math.max(0.2, ageFactor); 
        this.energy = clamp(this.energy + gained, 0, this.dna.energyCap);
    }
    update() {
        this.age++;
    if (this.age >= this.lifespan) {
        this.energy -= 0.5;

        const agingDuration = 120; // frames to tint
        const fadeDuration  = 120; // frames to fade

        const ageOver = this.age - this.lifespan;

        const healthyColor = this.dna.healthyColor;     // [r,g,b,a]
        const agingColor   = [0, 204, 0, 0.9];          // target tint

        if (ageOver <= agingDuration) {
            // Phase 1: lerp healthy → old color
            const t = ageOver / agingDuration;
            this.dna.color = lerpColor(healthyColor, agingColor, t);
        } else {
            // Phase 2: fade alpha only
            const fadeT = Math.min((ageOver - agingDuration) / fadeDuration, 1);
            const [r,g,b,a] = agingColor;
            this.dna.color = [r, g, b, a * (1 - fadeT)];
        }
    }
        else {
            // grow based on energy surplus or a fixed rate
            const growthRate = 0.02 * (this.energy / this.dna.energyCap);
            this.radius = Math.min(this.radius + growthRate, this.dna.maxRadius);
        }
        this.move();
    }
    canSpawn() {
        let chance = Math.random() > this.dna.spawnChance; 
        return (chance && this.energy >= this.dna.reproductionThreshold && this.radius === this.dna.maxRadius);
    }
    mutateDNA(parentDNA, mutationRate, mutationStrength) {
        const childDNA = { ...parentDNA };
        for (let key in childDNA) {
            if (typeof childDNA[key] === "number" && Math.random() < mutationRate) {
                const factor = 1 + (Math.random() * 2 - 1) * mutationStrength;
                childDNA[key] *= factor;
            }
        }
        return childDNA;
    }
    spawn(config, type) {
        // Apply mutation
        const mutationRate = 0.3;   // % chance a given trait mutates
        const mutationStrength = 0.6; // % variation
        const babyDNA = this.mutateDNA(this.dna, mutationRate, mutationStrength);//JSON.parse(JSON.stringify(config.item(this.type)));
        
        const baby = new Critter(config, type, babyDNA);
        baby.x = this.x + (Math.random() - 0.5) * 10;
        baby.y = this.y + (Math.random() - 0.5) * 10;
        baby.energy = this.dna.reproductionCost;
        // Parent pays the cost
        this.energy = clamp(this.energy - this.dna.reproductionCost, 0, this.dna.energyCap);
        this.radius = 4;
        return baby;
    }
    propel() {
        // compute current speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        // threshold below which we consider the critter "stationary"
        //const threshold = 0.6;

        if (speed < this.global.isStationary && this.energy > this.dna.propulsionThreshold) {
            // choose a random direction
            const angle = Math.random() * 2 * Math.PI;

            // choose a small propulsion magnitude
            //const propulsion = 0.5; // tweak for how strong the "kick" is

            // apply it to velocity
            this.vx += Math.cos(angle) * this.global.propulsionKick;
            this.vy += Math.sin(angle) * this.global.propulsionKick;
            this.energy -= this.dna.propulsionCost;
        }
    }
    move() {
        this.x += this.vx;
        this.y += this.vy;
        
        this.wraparoundEdges();
        
        // if velocity is tiny, stop completely (avoid endless drifting)
    // ------------------        
        
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        // clamp to maxSpeed
        if (speed > this.dna.maxSpeed) {
            //const scale = this.dna.maxSpeed / speed;
            //this.vx *= scale;
            //this.vy *= scale;
        }
        // clamp to minSpeed (only if nonzero)
        if (speed < this.dna.minSpeed && speed > 0) {
            //const scale = this.dna.minSpeed / speed;
            //this.vx *= scale;
            //this.vy *= scale;
        }
        // --- APPLY DRAG ---
        this.vx -= this.vx * Math.abs(this.vx) * this.global.dragCoefficient;
        this.vy -= this.vy * Math.abs(this.vy) * this.global.dragCoefficient;
        if (Math.abs(this.vx) < 0.001) this.vx = 0;
        if (Math.abs(this.vy) < 0.001) this.vy = 0;
        // ------------------  
        
        // energy cost proportional to speed
        const lostEnergy = this.dna.movementCost + speed * speed * this.dna.speedEnergyCost; // quadratic
        this.energy = clamp(this.energy - lostEnergy, 0, this.dna.energyCap);
        this.propel();
    }
    draw(ctx) {
        const artist = DrawingStrategy.forType(this.type);
        artist.draw(ctx, this);   
    }
}