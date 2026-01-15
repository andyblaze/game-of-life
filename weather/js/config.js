import { TempReader, WindReader } from "./sensor-readers.js";
import { TempConversionStrategy, WindConversionStrategy } from "./conversion-strategies.js";

export const config = { 
    "readers": {
        "temp": new TempReader(),
        "wind": new WindReader()
    },
    "converters": {
        "temp": new TempConversionStrategy(),
        "wind": new WindConversionStrategy()
    }
};