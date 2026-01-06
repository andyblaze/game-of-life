
export const config = {
    gridSize: 5,
    prizeMap: {
        row: 8,
        column: 8,
        diagonal: 12,
        corners: 15,
        full: 35
    },
    ranges: [
        { min: 1,  max: 15 },
        { min: 16, max: 30 },
        { min: 31, max: 45 },
        { min: 46, max: 60 },
        { min: 61, max: 75 }
    ],
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
        ["Kelly's Eye", "On its own", "The lonely one"],                     // 1
        ["One Little Duck", "Me and You", "All the twos"],                   // 2
        ["Cup of Tea", "You and Me", "Three’s company"],                     // 3
        ["Knock at the Door", "Four on the floor"],                          // 4
        ["Man Alive", "High five", "Take five"],                             // 5
        ["Tom Mix", "Half a dozen"],                                         // 6
        ["Lucky Seven", "Jackpot number", "Seven heaven"],                   // 7
        ["Garden Gate", "Eight waiting"],                                    // 8
        ["Doctor’s Orders", "Feeling fine", "Nearly ten"],                   // 9
        ["Prime Minister’s Den", "Perfect ten", "Top marks"],                // 10
        ["Legs Eleven", "All the ones", "Make a wish"],                      // 11
        ["One Dozen", "Eggs for breakfast"],                                 // 12
        ["Unlucky for Some", "Friday feeling"],                              // 13
        ["Valentine’s Day", "Love is in the air"],                           // 14
        ["Young and Keen", "Quarter way there"],                             // 15
        ["Sweet Sixteen", "Never been kissed"],                              // 16
        ["Dancing Queen", "Young and sweet"],                                // 17
        ["Coming of Age", "Finally legal", "Grown up now"],                  // 18
        ["Goodbye Teens", "Last of the teens"],                              // 19
        ["One Score", "Plenty more"],                                        // 20
        ["Key of the Door", "Adult age", "House key number"],                // 21
        ["Two Little Ducks", "Quack quack", "All the twos again"],           // 22
        ["Thee and Me", "You and me", "Jordan number"],                      // 23
        ["Two Dozen", "Plenty more"],                                        // 24
        ["Duck and Dive", "Stay alive"],                                     // 25
        ["Pick and Mix", "Halfway to fifty"],                                // 26
        ["Gateway to Heaven", "Lucky steps"],                                 // 27
        ["In a State", "Late again"],                                        // 28
        ["Rise and Shine", "Nearly thirty"],                                 // 29
        ["Dirty Gertie", "Flirty thirty"],                                   // 30
        ["Get Up and Run", "Early start"],                                   // 31
        ["Buckle My Shoe", "All the twos and threes"],                       // 32
        ["Dirty Knee", "Double threes"],                                     // 33
        ["Ask for More", "One more please"],                                 // 34
        ["Jump and Jive", "Stay alive"],                                     // 35
        ["Three Dozen", "Full boxes"],                                       // 36
        ["More than Eleven", "Big numbers now"],                             // 37
        ["Christmas Cake", "Getting rich"],                                  // 38
        ["Steps", "Tragedy", "Pop royalty"],                                 // 39
        ["Naughty Forty", "Life begins"],                                    // 40
        ["Time for Fun", "Just begun"],                                      // 41
        ["Winnie the Pooh", "Think of the bear"],                            // 42
        ["Down on Your Knees", "Say please"],                                // 43
        ["Droopy Drawers", "All the fours"],                                 // 44
        ["Halfway There", "Midlife number"],                                 // 45
        ["Up to Tricks", "Cheeky number"],                                   // 46
        ["Four and Seven", "In heaven"],                                     // 47
        ["Four Dozen", "Nearly fifty"],                                      // 48
        ["PC", "Copper’s number"],                                           // 49
        ["Half a Century", "Golden number", "Fifty nifty"],                 // 50
        ["Tweak of the Thumb", "On the run"],                                // 51
        ["Danny La Rue", "Showtime"],                                        // 52
        ["Stuck in the Tree", "All the threes"],                             // 53
        ["Clean the Floor", "Knock knock"],                                  // 54
        ["Snakes Alive", "Double nickels"],                                  // 55
        ["Was She Worth It?", "All the fives"],                              // 56
        ["Heinz Varieties", "Ketchup number"],                               // 57
        ["Make Them Wait", "Nearly there"],                                  // 58
        ["Brighton Line", "Last of the fifties"],                            // 59
        ["Five Dozen", "Top of the shop"],                                   // 60
        ["Baker’s Bun", "Sticky fingers"],                                   // 61
        ["Turn on the Screw", "Tick tock"],                                  // 62
        ["Tickle Me", "Lucky for some"],                                     // 63
        ["Red Raw", "All the sixes"],                                        // 64
        ["Old Age Pension", "Retirement time"],                              // 65
        ["Clickety Click", "All the clicks", "Route 66"],                   // 66
        ["Made in Heaven", "Lucky pair"],                                    // 67
        ["Saving Grace", "Nearly there"],                                    // 68
        ["Either Way Up", "Cheeky one"],                                     // 69
        ["Three Score & Ten", "Grand old age"],                              // 70
        ["Bang on the Drum", "Lucky beat"],                                  // 71
        ["Six Dozen", "Fully loaded"],                                       // 72
        ["Queen B", "All the threes and fours"],                             // 73
        ["Candy Store", "Sweet treat"],                                      // 74
        ["Strive and Strive", "Last one alive", "Game over"]                // 75
    ]
};
