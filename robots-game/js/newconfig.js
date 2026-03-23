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
            ]
        };
    }
    getMessage(type) {
        return randomFrom(this.messages[type]);
    }
}