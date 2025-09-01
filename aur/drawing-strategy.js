class AuroraDrawing {
    constructor() {}
    draw(ctx, aurora) {
        const a = aurora;


        // dimensions
        const w = ctx.canvas.width;
        const h = ctx.canvas.height-420;


// rectangle parameters
const rectX = 0;//w* 0.1;
const rectWidth = w;// * 0.8;
const rectTop = h * 0.1;
const rectBottom = 360;//h * 0.6;
const waveHeight = 20;

// gradient fill
const grad = ctx.createLinearGradient(0, rectTop, 0, rectBottom + waveHeight);
grad.addColorStop(0, "rgba(0,255,100,0)");   // top transparent
grad.addColorStop(0.6, "rgba(0,255,100,0.4)");
grad.addColorStop(1, "rgba(0,255,100,0.7)");
ctx.fillStyle = grad;

// soften edges
//ctx.shadowBlur = 15;
//ctx.shadowColor = "rgba(0,255,100,0.5)";

// draw path
ctx.beginPath();
ctx.moveTo(rectX, rectTop);                // top-left
ctx.lineTo(rectX + rectWidth, rectTop);    // top-right
ctx.lineTo(rectX + rectWidth, rectBottom); // bottom-right start

// smooth wavy bottom using Bezier curves
const waveCount = 8; // number of waves along bottom
const waveSegment = rectWidth / waveCount;

for (let i = 0; i < waveCount; i++) {
  const x0 = rectX + rectWidth - i * waveSegment;
  const x1 = x0 - waveSegment / 2;
  const x2 = x0 - waveSegment;
  
  const y0 = rectBottom;
  const y1 = rectBottom + (i % 2 === 0 ? Math.random() * 14 + waveHeight : -waveHeight);
  const y2 = rectBottom;

  ctx.bezierCurveTo(x1, y1, x1, y1, x2, y2);
}

ctx.lineTo(rectX, rectBottom); // bottom-left
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

