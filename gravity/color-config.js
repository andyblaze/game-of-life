export default class ColorConfig {
    static items = [
        { base: { h: 200, s: 80, l: 40 }, accent: { h: 220, s: 90, l: 55 } }, // deep ocean blue
        { base: { h: 280, s: 70, l: 40 }, accent: { h: 320, s: 80, l: 60 } }, // deep purple
        { base: { h: 30,  s: 90, l: 50 }, accent: { h: 50,  s: 90, l: 60 } }, // orange
        { base: { h: 0,   s: 90, l: 40 }, accent: { h: 20,  s: 100, l: 60 } }, // deep red
        { base: { h: 260, s: 50, l: 60 }, accent: { h: 300, s: 60,  l: 70 } }, // soft purple
        { base: { h: 10,  s: 80, l: 60 }, accent: { h: 25,  s: 90,  l: 70 } }, // warm coral
        { base: { h: 180, s: 50, l: 70 }, accent: { h: 200, s: 60,  l: 80 } }, // pale cyan
        { base: { h: 270, s: 50, l: 50 }, accent: { h: 310, s: 60,  l: 65 } }, // mid purple

        // NEW PALETTES BELOW -----------------------------

        { base: { h: 330, s: 85, l: 55 }, accent: { h: 350, s: 90, l: 65 } }, // neon pink
        { base: { h: 255, s: 85, l: 45 }, accent: { h: 270, s: 95, l: 60 } }, // electric indigo
        { base: { h: 315, s: 90, l: 50 }, accent: { h: 335, s: 95, l: 60 } }, // hot magenta
        { base: { h: 345, s: 80, l: 45 }, accent: { h: 5,   s: 85, l: 60 } }, // deep rose
        { base: { h: 290, s: 65, l: 55 }, accent: { h: 310, s: 80, l: 65 } }, // violet electric
        { base: { h: 230, s: 80, l: 45 }, accent: { h: 245, s: 90, l: 60 } }  // ultramarine glow
    ];

    static randomPalette() {
        const idx = Math.floor(Math.random() * this.items.length);
        return this.items[idx];
    }
}
