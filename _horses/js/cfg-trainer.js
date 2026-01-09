
export const CfgTrainer = {
  count: 3, // number of trainers to create
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
    }
  }
};
