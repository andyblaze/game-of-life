import { mt_rand, lerpColor } from "./functions.js";

class PlantDrawing {
    constructor() {

    }
    draw(ctx, plant) { return;
        const p = plant;
        const w = ctx.canvas.width;
        const h = skyHeight(ctx.canvas.height);
        // Draw once
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        drawCoralBranch(ctx, mt_rand(199, 2700)/2, h, 40, -Math.PI / 2, 8);
    }
}
export class Type1Drawing extends PlantDrawing {
    constructor() {
        super();
    }
}
export class Type2Drawing extends PlantDrawing {
    constructor() {
        super();
    }
    /*draw(ctx, aurora) {
        const a = aurora;

        // draw the Type2 light     
    }*/
}
export class Type3Drawing extends PlantDrawing {
    constructor() {
        super();
    }
    /*draw(ctx, aurora) {
        const a = aurora;

        // draw the Type2 light     
    }*/
}

