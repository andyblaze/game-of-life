
export const config = {
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
        }/*,
        ANY: {
            ERROR: { to: "ERROR" }
        }*/
    },
    payoutModel: {
        calculation: "FIXED",  // FIXED | MULTIPLIER | TABLE
        betUnit: 1
    },
    defaultPayout: 0,
    payouts: {
        "CHERRY,CHERRY,": 1,
        "LEMON,LEMON,": 2,
        "PLUM,PLUM,": 3,
        "BELL,BELL,": 4,
        "SEVEN,SEVEN,": 5,
        "CHERRY,CHERRY,CHERRY": 5,
        "LEMON,LEMON,LEMON": 8,
        "PLUM,PLUM,PLUM": 12,
        "BELL,BELL,BELL": 25,
        "SEVEN,SEVEN,SEVEN": 100,
        "CHERRY,CHERRY,WILD": 5,
        "LEMON,LEMON,WILD": 8,
        "PLUM,PLUM,WILD": 12,
        "BELL,BELL,WILD": 25,
        "SEVEN,SEVEN,WILD": 100
    },
    prizeTiers: {
        SMALL:    { rank: 1 },
        MEDIUM:   { rank: 2 },
        LARGE:    { rank: 3 },
        JACKPOT:  { rank: 4 }
    },
    paylines: [
        [0, 0, 0] // center line only for now
    ],
    symbols: {
        CHERRY: { tier: "SMALL" },
        LEMON:  { tier: "SMALL" },
        PLUM:   { tier: "MEDIUM" },
        ORANGE: { tier: "MEDIUM" },
        BELL:   { tier: "LARGE" },
        SEVEN:  { tier: "JACKPOT" },
        WILD:   { tier: "WILD", wild: true }
    },
    prizes: {
        enabled: true,
        model: "REEL_BASED",   // outcome emerges from reels
        allowMultipleWins: false
    },
    reelOrder: ["reel1", "reel2", "reel3"],
    reels: {
        reel1:  [
            "CHERRY", "CHERRY", "CHERRY", "CHERRY", "CHERRY", "CHERRY", "CHERRY", // 7  
            "LEMON", "LEMON", "LEMON", "LEMON", "LEMON",                          // 5
            "PLUM", "PLUM", "PLUM", "PLUM",                                       // 4
            "ORANGE", "ORANGE",                                                   // 2
            "BELL", "BELL",                                                               // 1
            "SEVEN"                                                              // 1
        ],
        reel2: [
            "CHERRY", "CHERRY", "CHERRY", "CHERRY", "CHERRY", "CHERRY", "CHERRY", "CHERRY", // 8
            "LEMON", "LEMON", "LEMON", "LEMON", "LEMON", "LEMON",                           // 6
            "PLUM", "PLUM", "PLUM", "PLUM",                                                 // 4
            "ORANGE", "ORANGE",                                                             // 2
            "BELL", "BELL",                                                                        // 1
            "SEVEN"                                                                         // 1
        ],
        reel3: [
            "CHERRY", "CHERRY", "CHERRY", "CHERRY", "CHERRY",
            "CHERRY", "CHERRY", "CHERRY", "CHERRY", //"CHERRY", 
            //"CHERRY", "CHERRY", //"CHERRY", "CHERRY", "CHERRY",                              // 9
            "LEMON", "LEMON", "LEMON", "LEMON", "LEMON", "LEMON", "LEMON",                // 7
            "PLUM", "PLUM", "PLUM", "PLUM",                                               // 4
            "ORANGE", "ORANGE",                                                           // 2
            "BELL", "BELL",                                                                      // 1
            "SEVEN" ,
            "WILD", "WILD", "WILD"                                                           // 1
        ]

    }

};
