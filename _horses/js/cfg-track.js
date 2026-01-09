
export const CfgTrack = {
  distances: [1000, 1500, 2000],
  surfaces: [0, 1, 2], // 0=soft,1=good,2=hard
  attributes: {
    bias: { // hidden factor affecting performance (multiplier)
      distribution: "normal",
      mean: 1.0,
      stddev: 0.05,
      min: 0.8,
      max: 1.2
    }
  }
};
