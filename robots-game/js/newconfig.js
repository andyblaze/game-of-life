import { randomFrom } from "./functions.js";
export default class Config {
    constructor() {
        this.messages = {
            "iron": [
                "A message",
                "Message to you",
                "Help me Tom Cruise",
                "There's a problem",
                "All is not well",
                "A collapse",
                "Many people unwell"
            ]
        };
    }
    getMessage(type) {
        return randomFrom(this.messages[type]);
    }
}