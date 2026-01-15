import { TempReader, WindReader, CloudCoverReader, PressureReader, RainReader } from "./sensor-readers.js";
import { 
  TempConversionStrategy, WindConversionStrategy, CloudConversionStrategy, 
  PressureConversionStrategy, RainConversionStrategy
} from "./conversion-strategies.js";

export const config = { 
    "readers": {
        "temp": new TempReader(),
        "wind": new WindReader(),
        "cloud": new CloudCoverReader(),
        "press": new PressureReader(),
        "rain": new RainReader()
    },
    "converters": {
        "temp": new TempConversionStrategy(),
        "wind": new WindConversionStrategy(),
        "cloud": new CloudConversionStrategy(),
        "press": new PressureConversionStrategy(),
        "rain": new RainConversionStrategy(),
    }
};