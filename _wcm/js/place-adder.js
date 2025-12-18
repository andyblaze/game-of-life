import { addEvent, byQuery } from "./functions.js";

export default class placeAdder {  
    getSvgCoords(evt, svg) {
        const pt = svg.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    init() {
        const svg = byQuery("#map svg");
        addEvent(svg, "click", (e) => {
            // ignore clicks on existing towns
            if (e.target.closest(".town")) return;
            let { x, y } = this.getSvgCoords(e, svg);
            x = parseInt(x);
            y = parseInt(y);
            const name = prompt("Town name?");
            if (!name) return;
            const nl = "\n"; const t = "\t";
            console.log(`<g class="town" id="${name.toLowerCase()}" data-name="${name}">${nl+t}<circle cx="${x}" cy="${y}" r="9" />${nl+t}<text x="${(x + 10)}" y="${(y + 4)}">${name}</text>${nl}</g>`);
        });
    }
}