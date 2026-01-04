export default class BingoCardManager {
    constructor(gridGenerator) {
        this.gridGenerator = gridGenerator; // your GridGenerator instance
        this.existingCards = new Set();     // stores flattened card keys
        this.cards = [];                    // stores actual card arrays
    }

    // Convert a 2D card array into a flat string key
    static cardKey(card) {
        return card.flat().join(",");
    } 

    // Generate a single unique card
    generateUniqueCard(size = 5, ranges = null, maxAttempts = 100) {
        let attempts = 0;
        while (attempts < maxAttempts) {
            const candidate = this.gridGenerator.generate(size, ranges);
            const key = BingoCardManager.cardKey(candidate);

            if (!this.existingCards.has(key)) {
                this.existingCards.add(key);
                this.cards.push(candidate);
                return candidate;
            }

            attempts++;
        }
        throw new Error("Unable to generate a unique card after max attempts");
    }

    // Generate multiple unique cards at once
    generateMultipleCards(count, size = 5, ranges = null) {
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(this.generateUniqueCard(size, ranges));
        }
        return result;
    }

    // Optional: reset all stored cards
    reset() {
        this.existingCards.clear();
        this.cards = [];
    }
}
