import { mt_rand, skyHeight } from "./functions.js";

class AuroraDrawing {
    constructor() {
        this.offset = -1;
    }

    draw(ctx, aurora) {
        const a = aurora;
        // dimensions
        const w = ctx.canvas.width;
        const h = skyHeight(ctx.canvas.height);
        // gradient fill
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "rgba(" + a.color.join(",") + ",0)");   // top transparent
        grad.addColorStop(0.6, "rgba(" + a.color.join(",") + ",0.2)");
        grad.addColorStop(0.8, "rgba(" + a.color.join(",") + ",0.3)");
        grad.addColorStop(1, "rgba(" + a.color.join(",") + ",0.75)");
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        this.offset--;
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

