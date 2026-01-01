
export const config = {
    initialState: "IDLE",

    states: [
        "IDLE",
        "READY",
        "DRAWING",
        "CHECKING",
        "FINISHED"
    ],
    transitions: { 
        IDLE: { INIT: { to: "READY" } },
        READY: {
            DRAW: { to: "DRAWING" },
            RESET: { to: "IDLE" }
        },
        DRAWING: { DRAW_COMPLETE: { to: "CHECKING" } },
        CHECKING: { 
            CHECK_COMPLETE: { to: "READY" },
            END_GAME: { to: "FINISHED" }
        },
        FINISHED: { RESET: { to: "IDLE" } }
    },
    "numberTexts": [
        null, // placeholder so index 1 maps to number 1
        "Kelly's Eye",                // 1
        "One Little Duck",            // 2
        "Cup of Tea",                 // 3
        "Knock at the Door",          // 4
        "Man Alive",                  // 5
        "Tom Mix",                    // 6
        "Lucky Seven",                // 7
        "Garden Gate",                // 8
        "Doctor’s Orders",            // 9
        "Prime Minister’s Den",       // 10
        "Legs Eleven",                // 11
        "One Dozen",                  // 12
        "Unlucky for Some",           // 13
        "Valentine’s Day",            // 14
        "Young and Keen",             // 15
        "Sweet Sixteen",              // 16
        "Dancing Queen",              // 17
        "Coming of Age",              // 18
        "Goodbye Teens",              // 19
        "One Score",                  // 20
        "Key of the Door",            // 21
        "Two Little Ducks",           // 22
        "Thee and Me",                // 23
        "Two Dozen",                  // 24
        "Duck and Dive",              // 25
        "Pick and Mix",               // 26
        "Gateway to Heaven",          // 27
        "In a State",                 // 28
        "Rise and Shine",             // 29
        "Dirty Gertie",               // 30
        "Get Up and Run",             // 31
        "Buckle My Shoe",             // 32
        "Dirty Knee",                 // 33
        "Ask for More",               // 34
        "Jump and Jive",              // 35
        "Three Dozen",                // 36
        "More than Eleven",           // 37
        "Christmas Cake",             // 38
        "Steps",                      // 39
        "Naughty Forty",              // 40
        "Time for Fun",               // 41
        "Winnie the Pooh",            // 42
        "Down on your Knees",         // 43
        "Droopy Drawers",             // 44
        "Halfway There",              // 45
        "Up to Tricks",               // 46
        "Four and Seven",             // 47
        "Four Dozen",                 // 48
        "PC",                         // 49
        "Half a Century",             // 50
        "Tweak of the Thumb",         // 51
        "Danny La Rue",               // 52
        "Stuck in the Tree",          // 53
        "Clean the Floor",            // 54
        "Snakes Alive",               // 55
        "Was she worth it?",          // 56
        "Heinz Varieties",            // 57
        "Make them Wait",             // 58
        "Brighton Line",              // 59
        "Five Dozen",                 // 60
        "Baker’s Bun",                // 61
        "Turn on the Screw",          // 62
        "Tickle Me 63",               // 63
        "Red Raw",                    // 64
        "Old Age Pension",            // 65
        "Clickety Click",             // 66
        "Made in Heaven",             // 67
        "Saving Grace",               // 68
        "Either Way Up",              // 69
        "Three Score & Ten",          // 70
        "Bang on the Drum",           // 71
        "Six Dozen",                  // 72
        "Queen B",                    // 73
        "Candy Store",                // 74
        "Strive and Strive"           // 75
    ]
};
