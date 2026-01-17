import { randomFrom } from "./functions.js";

export class BeaufortClassifier {
  classify(mph) {
    const scale = [
      { max: 1, label: 0 },
      { max: 3, label: 1 },
      { max: 7, label: 2 },
      { max: 12, label: 3 },
      { max: 18, label: 4 },
      { max: 24, label: 5 },
      { max: 31, label: 6 },
      { max: 38, label: 7 },
      { max: 46, label: 8 },
      { max: 54, label: 9 },
      { max: 63, label: 10 },
      { max: 72, label: 11 },
      { max: Infinity, label: 12 }
    ];

    return scale.find(s => mph <= s.max).label;
  }
}

export class CloudClassifier {
  classify(percent) {
    const levels = [
      { max: 10, label: "clear" },
      { max: 30, label: "mostly clear" },
      { max: 60, label: "partly cloudy" },
      { max: 90, label: "overcast" },
      { max: 100, label: "heavy overcast" }
    ];

    return levels.find(l => percent <= l.max).label;
  }
}

export class WindDirectionClassifier {
  classify(deg) {
    const dirs = [
      "N","NNE","NE","ENE",
      "E","ESE","SE","SSE",
      "S","SSW","SW","WSW",
      "W","WNW","NW","NNW","N"
    ];
    const idx = Math.round(deg / 22.5);
    return dirs[idx];
  }
}

export class SeaStateClassifier {
    static classify() {
        const states = ["Calm", "Slight", "Moderate", "Rough", "Very rough"];
        return { type: "sea_state", unit: "TXT", data: randomFrom(states) };
    }
}

export class VisibilityClassifier {
    static classify() {
        const states = ["Good", "Moderate", "Poor", "Very poor"];
        return { type: "vis", unit: "TXT", data: randomFrom(states) };
    }    
}