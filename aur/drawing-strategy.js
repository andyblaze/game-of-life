import { mt_rand } from "./functions.js";

class AuroraDrawing {
    constructor() {
        this.offset = -1;
    }

    draw(ctx, aurora) {
        const a = aurora;
        // dimensions
        const w = ctx.canvas.width;
        const h = ctx.canvas.height-220;
        // rectangle parameters
        const rectX = 0;//w* 0.1;
        const rectWidth = w;// * 0.8;
        const rectTop = h * 0.1;
        const rectBottom = 590;//h * 0.6;

        // gradient fill
        const grad = ctx.createLinearGradient(0, 0, 0, rectBottom);
        grad.addColorStop(0, "rgba(" + a.color.join(",") + ",0)");   // top transparent
        grad.addColorStop(0.6, "rgba(" + a.color.join(",") + ",0.1)");
        grad.addColorStop(0.8, "rgba(" + a.color.join(",") + ",0.3)");
        grad.addColorStop(1, "rgba(" + a.color.join(",") + ",0.75)");
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, rectBottom);
    }
}
export class Type1Drawing extends AuroraDrawing {
    constructor() {
        super();
    }
}
export class Type2Drawing extends AuroraDrawing {
    constructor() {
        super();
    }
    /*draw(ctx, aurora) {
        const a = aurora;

        // draw the Type2 light     
    }*/
}
export class Type3Drawing extends AuroraDrawing {
    constructor() {
        super();
    }
    /*draw(ctx, aurora) {
        const a = aurora;

        // draw the Type2 light     
    }*/
}

