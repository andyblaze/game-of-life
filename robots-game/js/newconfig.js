import { randomFrom } from "./functions.js";
export default class Config {
    constructor() {
        this.messages = {
            "iron": [
                "Help me Tom Cruise",
                "There's a problem",
                "All is not well",
                "A collapse",
                "Many people unwell"
            ],
            "coal": [
                "Weird scenes",
                "Fire in the hole",
                "Black lung",
                "The canary dies" 
            ],
            "wheat": [
                "Open fields",
                "Plants grow",
                "Blight!",
                "Locusts!",
                "Rain again"
            ],
            "wood": [
                "I'm up a tree",
                "A tree fell on me",
                "TIMBER!",
                "I like trees",
                "Cut that tree"
            ],
            "human": [
                "I'm on fire!",
                "My legs hurt",
                "I feel sad",
                "Where are my friends?",
                "I can't feel my feet!"
            ],
            "population": [
                "We're happy",
                "We're sad",
                "Where do people go?",
                "Why are you doing this?",
                "Are you sentient?"
            ]
        };
    }
    getMessage(type) {
        return randomFrom(this.messages[type]);
    }
}