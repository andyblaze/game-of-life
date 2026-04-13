export const GameBalance = {
    outputs: {
        iron: 1,
        coal: 4,
        wood: 6,
        wheat: 3,
        bread: 16,
        power: 2
    },
    inputs: {
        bread: {
            wheat: { type: "wheat", amount: 16 },
            wood: { type: "wood", amount: 16 }
        },
        power: {
            coal: { type: "coal", amount: 18 },
            wood: { type: "wood", amount: 12 },
            wheat: { type: "wheat", amount: 32 }
        }
    }
};
