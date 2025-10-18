export default class AudioProcessor {
    transform(data) { return {};
        return Object.entries(data).map(([symbol, coin], index) => {
            const toNum = (v) => (v != null && !isNaN(v)) ? Number(v) : 0;

            const price = toNum(coin.priceUsd);
            const marketCap = toNum(coin.marketCapUsd);
            const change = toNum(coin.changePercent24Hr);

            // --- Derived render parameters ---
            const radius = Math.max(4, Math.log10(price || 1) * 5);
            // Orbit distance based on rank or market cap (spread out visually)
            const orbitRadius = Math.log10(marketCap + 1) * 15 + (index * 4);
            // Speed: more volatile coins orbit faster
            const orbitSpeed = 0.001 + Math.abs(change) * 0.00005;
            // Random start angle to distribute around circle
            const angle = Math.random() * Math.PI * 2;
            // Color hint: green for positive, red for negative
            const color = change >= 0 ? '#5f5' : '#f55';

            return {
                symbol,
                id: coin.id,
                priceUsd: price,
                supply: toNum(coin.supply),
                maxSupply: coin.maxSupply ? toNum(coin.maxSupply) : null,
                marketCapUsd: marketCap,
                volumeUsd24Hr: toNum(coin.volumeUsd24Hr),
                changePercent24Hr: change,
                vwap24Hr: toNum(coin.vwap24Hr),

                // --- orbital render properties ---
                radius,
                orbitRadius,
                orbitSpeed,
                angle,
                color
            };
        });
    }
}