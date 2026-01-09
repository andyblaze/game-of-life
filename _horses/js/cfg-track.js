
export const CfgTrack = {
  count: 2, // number of tracks to create
  distances: [1000, 1500, 2000],
  attributes: {
    surface: { // numeric representation (0=soft, 1=good, 2=hard)
      distribution: "uniform",
      min: 0,
      max: 2
    },
    bias: { // hidden factor affecting performance (multiplier)
      distribution: "normal",
      mean: 1.0,
      stddev: 0.05,
      min: 0.8,
      max: 1.2
    }
  }
};
