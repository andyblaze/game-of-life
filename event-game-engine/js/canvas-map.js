export default class CanvasMap {
    constructor(canvas, svgSource) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.svgSource = svgSource; // can be selector string or file path
    }

    async load() {
        let svgText;

        // Determine if svgSource is a DOM selector or file path
        if (this.svgSource.startsWith("#")) {
            // Inline SVG
            const svg = document.querySelector(this.svgSource);
            if (!svg) throw new Error(`SVG element not found: ${this.svgSource}`);
            svgText = new XMLSerializer().serializeToString(svg);
        } else {
            // External file
            const response = await fetch(this.svgSource);
            if (!response.ok) throw new Error(`Failed to fetch SVG: ${this.svgSource}`);
            svgText = await response.text();
        }

        // Parse viewBox for canvas size
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const viewBox = svgDoc.documentElement.getAttribute("viewBox").split(" ").map(Number);
        const [vbX, vbY, vbWidth, vbHeight] = viewBox; 

        /*this.canvas.width = vbWidth;
        this.canvas.height = vbHeight;*/

        // Convert SVG text to an image and draw to canvas
        console.log(svgText);
        const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0, vbWidth, vbHeight);
                URL.revokeObjectURL(url);
                console.log("SVG drawn to canvas");
                resolve();
            };
            img.onerror = (e) => console.error("Failed to load SVG", e);
            img.src = url;
        });
    }
}
