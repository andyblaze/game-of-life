export const CfgRaceModel = {
  baseWeights: {
    speed: 0.5,
    endurance: 0.5
  },

  trainerEffect: {
    enabled: true,
    mode: "multiplier" // future-proofing
  },

  trackEffect: {
    enabled: true
  },

  distanceAffinity: {
    enabled: true,
    multiplier: 0.1
  },

  noise: {
    min: 0.95,
    max: 1.05
  }
};
