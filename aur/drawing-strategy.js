import { mt_rand } from "./functions.js";

class AuroraDrawing {
    constructor() {}
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
const waveHeight = 20;

// gradient fill
const grad = ctx.createLinearGradient(0, rectTop, 0, rectBottom + waveHeight);
grad.addColorStop(0, "rgba(" + aurora.color.join(",") + ",0)");   // top transparent
grad.addColorStop(0.6, "rgba(" + aurora.color.join(",") + ",0.4)");
grad.addColorStop(1, "rgba(" + aurora.color.join(",") + ",0.7)");
ctx.fillStyle = grad;

// soften edges
//ctx.shadowBlur = 15;
//ctx.shadowColor = "rgba(0,255,100,0.5)";

// parameters
const pointsCount = 40;//mt_rand(10,80); // number of points along the bottom
const minY = rectBottom - 25;
const maxY = rectBottom + 40;

// generate random points along the bottom
const bottomPoints = [];
for (let i = 0; i <= pointsCount; i++) {
  const t = i / pointsCount;
  const x = rectX + t * rectWidth;
  const y = minY + Math.random() * (maxY - minY);
  bottomPoints.push({x, y});
}

// add the first and last points explicitly at corners
bottomPoints.unshift({x: rectX, y: minY + Math.random() * (maxY - minY)});           // bottom-left
bottomPoints.push({x: rectX + rectWidth, y: minY + Math.random() * (maxY - minY)});  // bottom-right

ctx.beginPath();
ctx.moveTo(rectX, rectTop);                 // top-left
ctx.lineTo(rectX + rectWidth, rectTop);     // top-right
ctx.lineTo(bottomPoints[bottomPoints.length-1].x, bottomPoints[bottomPoints.length-1].y); // bottom-right

ctx.
// draw curves along all points
for (let i = bottomPoints.length - 1; i > 0; i--) {
  const p0 = bottomPoints[i];
  const p1 = bottomPoints[i-1];
  const cx = (p0.x + p1.x) / 2;
  const cy = (p0.y + p1.y) / 2;
  ctx.quadraticCurveTo(p0.x, p0.y, cx, cy);
}

ctx.closePath();
ctx.fill();

// reset shadowBlur
//ctx.shadowBlur = 0;
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

