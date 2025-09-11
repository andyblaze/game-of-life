import Perlin from "./perlin-noise.js";
import Voronoi from "./voronoi.js";

const perlin = new Perlin();
// ---------------------
// Canvas + Animation
// ---------------------
const canvas = document.getElementById("onscreen");
const ctx = canvas.getContext("2d");
let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();
const voronoi = new Voronoi();
// Sites
const numSites = 120;
let sites = [];
for (let i=0;i<numSites;i++) {
  sites.push({x:Math.random()*width, y:Math.random()*height, nx:Math.random()*1000, ny:Math.random()*1000});
}

function draw(cells, ctx, sites, width, height, t) {
    ctx.clearRect(0, 0, width, height);
    for ( let i = 0; i < cells.length; i++ ) {
        const cell = cells[i];
        if ( cell.length < 3 ) continue;
        ctx.beginPath();
        ctx.moveTo(cell[0].x, cell[0].y);
        for ( let j = 1; j < cell.length; j++ ) 
            ctx.lineTo(cell[j].x, cell[j].y);
        ctx.closePath();
        let hue=(sites[i].x / width * 360 + t * 0.02) % 360;
        ctx.fillStyle=`hsla(${hue},70%,40%,0.3)`;
        ctx.strokeStyle=`hsla(${hue},80%,70%,0.5)`;
        ctx.fill();
        ctx.stroke();
    }
}

function moveSites(sites, perlin) {
    // Move sites smoothly with noise
    sites.forEach(s=>{
        s.nx+= 0.002; 
        s.ny+= 0.002;
        s.x = (perlin.noise(s.nx, 0) + 1) * 0.5 * width;
        s.y = (perlin.noise(0, s.ny) + 1) * 0.5 * height;
    });
}

function animate(t) {
  moveSites(sites, perlin);
  const cells = voronoi.compute(sites, width, height);
  draw(cells, ctx, sites, width, height, t);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/*import Config from "./config.js";
import Controller from "./controller.js";
import Model from "./model.js";
import View from "./view.js";

window.addEventListener("DOMContentLoaded", () => {
    const controller = new Controller(
        new Model(Config), 
        new View("onscreen", Config), 
        Config
    );
    window.addEventListener("resize", controller.resize.bind(controller));
    window.addEventListener("click", function() {controller.paused = ! controller.paused;});
    controller.resize();
    controller.loop();
});*/
