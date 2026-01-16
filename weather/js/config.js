import { 
  TempReader, WindReader, WindDirReader,
  CloudCoverReader, PressureReader, RainReader 
} from "./sensor-readers.js";
import { 
  TempConversionStrategy, WindConversionStrategy, CloudConversionStrategy, 
  PressureConversionStrategy, RainConversionStrategy, WindDirConverter
} from "./conversion-strategies.js";

export const config = { 
    "readers": {
        "temp": new TempReader(),
        "wind": new WindReader(),
        "wind_dir": new WindDirReader(),
        "cloud": new CloudCoverReader(),
        "pressure": new PressureReader(),
        "rain": new RainReader()
    },
    "converters": {
        "temp": new TempConversionStrategy(),
        "wind": new WindConversionStrategy(),
        "wind_dir": new WindDirConverter(),
        "cloud": new CloudConversionStrategy(),
        "pressure": new PressureConversionStrategy(),
        "rain": new RainConversionStrategy(),
    }
};