import { randomNormal, randomUniform, clamp } from "./functions.js";

export default class AttributeFactory {
    static generate(attributeConfig) {
        const attrs = {};

        for (const [name, cfg] of Object.entries(attributeConfig)) {
        let value;

        if ( cfg.distribution === "normal" ) {
            value = randomNormal(cfg.mean, cfg.stddev);
        } else if ( cfg.distribution === "uniform" ) {
            value = randomUniform(cfg.min, cfg.max);
        } else if ( cfg.distribution === "categorical" ) {
            value = AttributeFactory.pickCategorical(cfg.categories, cfg.weights);
        } else {
            throw new Error(`Unknown distribution: ${cfg.distribution}`);
        }

        if ( cfg.min !== undefined && cfg.max !== undefined ) {
            value = clamp(value, cfg.min, cfg.max);
        }

        attrs[name] = value;
        }

        return attrs;
    }
    static pickCategorical(categories, weights) {
        if ( !weights ) {
        // equal probability if no weights supplied
            weights = Array(categories.length).fill(1 / categories.length);
        }

        const r = Math.random();
        let cumulative = 0;

        for (let i = 0; i < categories.length; i++) {
            cumulative += weights[i];
            if ( r < cumulative ) {
            return categories[i];
            }
        }

        // fallback in case of floating point rounding
        return categories[categories.length - 1];
    }
}