import { round } from "./functions.js";
import { BeaufortClassifier, CloudClassifier } from "./classifiers.js";

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

export class WindConversionStrategy extends ConversionStrategy {
    convert(reading) {
        const beaufort = new BeaufortClassifier();
        const mph = Math.round(reading.data * 2.23694)
        return {
            ...reading,
            "MPS": reading.data,
            "KMH": Math.round(reading.data * 3.6),
            "MPH": mph,
            "KNOTS": Math.round(reading.data * 1.94384),
            "BEAUFORT": beaufort.classify(mph)
        };
    }
}

export class CloudConversionStrategy extends ConversionStrategy {
    convert(reading) {
        const cloud = new CloudClassifier();
        return {
            ...reading,
            "PC": reading.data,
            "CLOUD": this.cloud.classify(reading.data)
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
