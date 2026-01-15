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
            F: reading.data * 9/5 + 32
        };
    }
}

export class WindConversionStrategy extends ConversionStrategy {
    convert(reading) {
        return {
            ...reading,
            kmh: reading.data * 3.6,
            mph: reading.data * 2.23694,
            knots: reading.data * 1.94384
        };
    }
}
