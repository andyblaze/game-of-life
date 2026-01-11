
export const CfgTrainer = {
  attributes: {
    skill: {
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
    },
    tactical: {
      distribution: "normal",
      mean: 0.0,
      stddev: 1.0,
      min: -2.0,
      max: 2.0
    },
    experience: {
      distribution: "uniform",
      min: 0.8,
      max: 1.2
    },
    specialtyDistance: {
      distribution: "categorical",
      categories: ["short", "medium", "long", null],
      weights: [0.25, 0.25, 0.25, 0.25]
    },
    horseDevelopment: {
      distribution: "normal",
      mean: 0.0,
      stddev: 0.5,
      min: -1.0,
      max: 1.0
    }
  }
};

