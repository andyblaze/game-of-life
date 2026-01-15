import { TempReader, WindReader, CloudCoverReader, PressureReader } from "./sensor-readers.js";
import { TempConversionStrategy, WindConversionStrategy, CloudConversionStrategy, PressureConversionStrategy } from "./conversion-strategies.js";

export const config = { 
    "readers": {
        "temp": new TempReader(),
        "wind": new WindReader(),
        "cloud": new CloudCoverReader(),
        "press": new PressureReader()
    },
    "converters": {
        "temp": new TempConversionStrategy(),
        "wind": new WindConversionStrategy(),
        "cloud": new CloudConversionStrategy(),
        "press": new PressureConversionStrategy()
    }
};