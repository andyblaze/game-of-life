
export const config = {
    prizeMap: {
        row: 8,
        column: 8,
        diagonal: 12,
        corners: 15,
        full: 35
    },
    initialState: "IDLE",

    states: [
        "IDLE",
        "SPINNING",
        "EVALUATING",
        "PAYOUT",
        "ERROR"
    ],
    transitions: {
        IDLE: {
            SPIN: { to: "SPINNING" }
        },
        SPINNING: {
            SPIN_COMPLETE: { to: "EVALUATING" }
        },
        EVALUATING: {
            EVALUATE_COMPLETE: { to: "PAYOUT" }
        },
        PAYOUT: {
            PAYOUT_COMPLETE: { to: "IDLE" }
        },
        ANY: {
            ERROR: { to: "ERROR" }
        }
    },
    payoutModel: {
        type: "FIXED",      // FIXED | MULTIPLIER | TABLE
        betUnit: 1
    },
    prizeTiers: [
        "SMALL",
        "MEDIUM",
        "LARGE",
        "JACKPOT"
    ],
    prizes: {
        enabled: true,
        model: "REEL_BASED",   // outcome emerges from reels
        allowMultipleWins: false
    }
};
