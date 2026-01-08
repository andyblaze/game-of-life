export default class PayoutTableBuilder {
    constructor(config) {
        this.payouts = config.payouts;
        this.symbolMap = config.symbolMap;
    }

    build() {
        const rows = [];

        Object.entries(this.payouts).forEach(([key, payout]) => {
            const symbols = key.split(",");

            // Normalize trailing empty strings
            const cleanSymbols = symbols.filter(s => s !== "");

            let type;

            if (cleanSymbols.length === 2) {
                type = "TWO_OF_A_KIND";
            } else if (cleanSymbols.length === 3 && cleanSymbols.includes("WILD")) {
                type = "WILD_SUB";
            } else if (cleanSymbols.length === 3) {
                type = "THREE_OF_A_KIND";
            } else {
                return; // ignore anything unexpected
            }

            rows.push({
                type,
                symbols: cleanSymbols,
                payout,
                images: cleanSymbols.map(sym => this.symbolMap[sym])
            });
        });

        return this._groupAndSort(rows);
    }

    _groupAndSort(rows) {
        const order = {
            TWO_OF_A_KIND: 1,
            THREE_OF_A_KIND: 2,
            WILD_SUB: 3
        };

        return rows.sort((a, b) => {
            if (order[a.type] !== order[b.type]) {
                return order[a.type] - order[b.type];
            }
            return a.payout - b.payout;
        });
    }
}
