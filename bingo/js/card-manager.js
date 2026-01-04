export default class BingoCardManager {
    constructor(gridGenerator) {
        this.gridGenerator = gridGenerator; // your GridGenerator instance
        this.existingCards = new Set();     // stores flattened card keys
        this.cards = [];                    // stores actual card arrays
    }
    // Convert a 2D card array into a flat string key
    static cardKey(card) {
        return card.numberGrid.flat().join(",");
    } 
    // Generate a single unique card
    generateUniqueCard(size, ranges, maxAttempts = 100) {
        let attempts = 0;
        while ( attempts < maxAttempts ) {
            const candidate = this.gridGenerator.generate(size, ranges);
            //console.log(candidate);
            const key = BingoCardManager.cardKey(candidate);
            //console.log(key);

            if ( !this.existingCards.has(key) ) {
                this.existingCards.add(key);
                this.cards.push(candidate);
                return candidate;
            }
            attempts++;
        }
        throw new Error("Unable to generate a unique card after max attempts");
    }
    // Generate multiple unique cards at once
    generateMultipleCards(size, ranges, count) {
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
