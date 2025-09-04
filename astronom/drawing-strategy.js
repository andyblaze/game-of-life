import { mt_rand, skyHeight, lerpColor } from "./functions.js";

// Recursive plant drawing (static)
function drawCoralBranch(ctx, x, y, length, angle, depth, width) {
  if (depth === 0 || length < 2) return;

  const x2 = x + Math.cos(angle) * length;
  const y2 = y + Math.sin(angle) * length;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = width;
  ctx.stroke();

  // Slight upward bias so coral "reaches up"
  const baseAngle = angle - 0.2 + Math.random() * 0.4;

  // Number of child branches (2–4)
  const branches = 2 + Math.floor(Math.random() * 3);

  for (let i = 0; i < branches; i++) {
    const newLength = length * (0.5 + Math.random() * 0.4); // shorter, irregular
    const newAngle = baseAngle + (Math.random() - 0.5) * 1.2; // wide spread
    drawCoralBranch(ctx, x2, y2, newLength, newAngle, depth - 1, width * 0.7);
  }
}

class PlantDrawing {
    constructor() {

    }
    draw(ctx, plant) {
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

