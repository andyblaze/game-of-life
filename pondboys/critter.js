import { clamp, mt_rand } from "./functions.js";

export default class Critter {
    constructor(config, type="prey") {
        this.globalCfg = config.global; 
        this.type = type;
        this.dna = config[type];
        this.initPosition(this.dna.maxSpeed);
        this.initProperties(this.dna);
    }
    initProperties(dna) {
        this.age = 0;
        const {min, max} = dna.lifespan;
        this.lifespan = mt_rand(min * 3600, max * 3600);
        this.energy = dna.energyCap / 2; // start at half cap
        this.energyCap = dna.energyCap;
        this.reproductionCost = dna.reproductionCost;
        this.movementCost = dna.movementCost;
        // assign color based on type
        if (this.type === "predator") {
            const hue = 0;  // red
            this.color = `hsla(${hue}, 80%, 50%, 0.5)`; // 0.5 alpha due to energy at 1/2 cap
        } else {
            const hue = 180 + Math.random();  //blue-ish
            this.color = `hsla(${hue}, 70%, 60%, 0.5)`;
        }
        this.maxSpeed = dna.maxSpeed;
    }
    initPosition(maxSpeed) {
        this.x = mt_rand(0, this.globalCfg.width);
        this.y = mt_rand(0, this.globalCfg.height);
        this.vx = (Math.random() - 0.5) * maxSpeed;
        this.vy = (Math.random() - 0.5) * maxSpeed;
        this.radius = 4;
    }
    wraparoundEdges() {
        if (this.x < 0) this.x += this.globalCfg.width;
        if (this.x > this.globalCfg.width) this.x -= this.globalCfg.width;
        if (this.y < 0) this.y += this.globalCfg.height;
        if (this.y > this.globalCfg.height) this.y -= this.globalCfg.height;
    }
    eat(foodEnergy) {
        // Scale energy gain by age fraction (older = weaker digestion)
        const ageFactor = 1 - (this.age / this.lifespan); 
        const gained = foodEnergy * Math.max(0.2, ageFactor); 
        this.energy = clamp(this.energy + gained, 0, this.energyCap);
    }
    update() {
        this.age++;
        if (this.age >= this.lifespan) {
            this.energy -= 0.5;
            const t = (this.age - this.lifespan) / 120; // 120 frames = about 2 seconds
            const alpha = Math.max(1 - t, 0);
            this.color = "hsla(120, 100%, 40%, 0.9)";
        }
        else {
            // grow based on energy surplus or a fixed rate
            const growthRate = 0.02 * (this.energy / this.energyCap);
            this.radius = Math.min(this.radius + growthRate, this.dna.maxRadius);
        }
        this.move();
    }
    canSpawn() {
        let chance = Math.random() > this.dna.spawnChance; 
        return (chance && this.energy >= this.dna.reproductionThreshold && this.radius === this.dna.maxRadius);
    }
    spawn(dna, type) {
        // Deep copy parent DNA
        const babyDNA = JSON.parse(JSON.stringify(dna));

        // Apply mutation
        const mutationRate = 0.1;   // 10% chance a given trait mutates
        const mutationStrength = 0.3; // ±10% variation

        for (let key in babyDNA) {
            if (typeof babyDNA[key] === "number" && Math.random() < mutationRate) {
                const change = 1 + (Math.random() * 2 - 1) * mutationStrength;
                babyDNA[key] = Math.max(0, babyDNA[key] * change); // no negatives
            }
        }
        const baby = new Critter(babyDNA, type);
        baby.x = this.x + (Math.random() - 0.5) * 10;
        baby.y = this.y + (Math.random() - 0.5) * 10;
        baby.energy = this.dna.reproductionCost;
        // Parent pays the cost
        this.energy = clamp(this.energy - this.dna.reproductionCost, 0, this.energyCap);
        this.radius = 4;
        return baby;
    }
    move() {
        this.x += this.vx;
        this.y += this.vy;
        
        this.wraparoundEdges();
        
        
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        // clamp to maxSpeed
        if (speed > this.dna.maxSpeed) {
            const scale = this.dna.maxSpeed / speed;
            this.vx *= scale;
            this.vy *= scale;
        }
        // clamp to minSpeed (only if nonzero)
        if (speed < this.dna.minSpeed && speed > 0) {
            const scale = this.dna.minSpeed / speed;
            this.vx *= scale;
            this.vy *= scale;
        }
        
        // energy cost proportional to speed
        const lostEnergy = this.dna.movementCost + speed * speed * this.dna.speedEnergyCost; // quadratic
        this.energy = clamp(this.energy - lostEnergy, 0, this.energyCap) 
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        // energy -> alpha
        const alpha = Math.min(this.energy / 100, 1);
        ctx.fillStyle = this.color.replace(/[\d\.]+\)$/g, `${alpha})`);
        ctx.fill();
    }
}