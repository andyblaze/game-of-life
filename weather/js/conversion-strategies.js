import { round } from "./functions.js";
import { BeaufortClassifier, CloudClassifier, WindDirectionClassifier } from "./classifiers.js";

class ConversionStrategy {
    convert(reading) {
        // returns an enriched reading object
        throw new Error("enrich() must be implemented");
    }
}

export class TempConversionStrategy extends ConversionStrategy {
    convert(reading) {
        return {
            ...reading,
            "C": reading.data,
            "F": Math.round(reading.data * 9/5 + 32)
        };
    }
}

export class WindDirConverter extends ConversionStrategy {
    convert(reading) {
        const cardinal = new WindDirectionClassifier();
        return {
            ...reading,
            "DEG": reading.data,
            "CARDINAL": cardinal.classify(reading.data)
        };
    }
}
export class WindConversionStrategy extends ConversionStrategy {
    convert(reading) {
        const beaufort = new BeaufortClassifier();
        const mps = Math.round(reading.data * 0.44704);
        return {
            ...reading,
            "MPH": reading.data,
            "MPS": mps,
            "KMH": Math.round(reading.data * 3.6),
            "KNOTS": Math.round(reading.data * 1.94384),
            "BEAUFORT": beaufort.classify(reading.data)
        };
    }
}

export class CloudConversionStrategy extends ConversionStrategy {
    convert(reading) {
        const cloud = new CloudClassifier();
        return {
            ...reading,
            "PC": reading.data,
            "CLOUD": cloud.classify(reading.data)
        };
    }
}

export class PressureConversionStrategy extends ConversionStrategy {
    convert(reading) {
        return {
            ...reading,
            "MB": reading.data
        };
    }
}

export class RainConversionStrategy extends ConversionStrategy {
    convert(reading) {
        return {
            ...reading,
            "MMH": reading.data,
            "INH": round(reading.data / 25.4)
        };
    }
}
