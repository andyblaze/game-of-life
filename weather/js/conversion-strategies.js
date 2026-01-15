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
            "F": reading.data * 9/5 + 32
        };
    }
}

export class WindConversionStrategy extends ConversionStrategy {
    convert(reading) {
        return {
            ...reading,
            "MPS": reading.data,
            "KMH": reading.data * 3.6,
            "MPH": reading.data * 2.23694,
            "KNOTS": reading.data * 1.94384
        };
    }
}

export class CloudConversionStrategy extends ConversionStrategy {
    convert(reading) {
        return {
            ...reading,
            "PC": reading.data
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
            "INH": reading.data / 25.4
        };
    }
}
