export default class BingoScorer {
    /**
     * prizeMap: map pattern names to prize/points
     * Example:
     * { row: 1, column: 1, full: 10, corners: 2 }
     */
    constructor(prizeMap = {}) {
        // default prizes if none provided
        this.prizeMap = Object.assign({
            row: 1,
            column: 1,
            full: 10,
            corners: 2
        }, prizeMap);
    }

    /**
     * Calculate which patterns the card currently has
     * Returns an array of { pattern, prize } objects
     */
    calculate(card) {
        const scores = [];

        if (card.hasWinningRow && card.hasWinningRow()) {
            scores.push({ pattern: 'row', prize: this.prizeMap.row });
        }

        if (card.hasWinningColumn && card.hasWinningColumn()) {
            scores.push({ pattern: 'column', prize: this.prizeMap.column });
        }

        if (card.hasFullCard && card.hasFullCard()) {
            scores.push({ pattern: 'full', prize: this.prizeMap.full });
        }

        if (card.hasCorners && card.hasCorners()) {
            scores.push({ pattern: 'corners', prize: this.prizeMap.corners });
        }

        return scores;
    }

    /**
     * Convenience method: total prize for current card
     */
    totalScore(card) {
        return this.calculate(card).reduce((sum, s) => sum + s.prize, 0);
    }
}
