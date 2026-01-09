
export const CfgHorseGenetics = {
  attributes: {
    speed: {
      distribution: "normal",
      mean: 0.0,
      stddev: 1.0,
      min: -3.0,
      max: 3.0
    },
    endurance: {
      distribution: "normal",
      mean: 0.0,
      stddev: 1.0,
      min: -3.0,
      max: 3.0
    },
    consistency: {
      distribution: "uniform",
      min: 0.5,
      max: 1.5
    }
  },
  affinities: {
    distance: {
      sprint: { mean: 0.0, stddev: 0.8 },
      mile:   { mean: 0.0, stddev: 0.8 },
      stayer: { mean: 0.0, stddev: 0.8 }
    },
    ground: {
      soft: { mean: 0.0, stddev: 0.8 },
      good: { mean: 0.0, stddev: 0.8 },
      hard: { mean: 0.0, stddev: 0.8 }
    }
  }
};
