import Config from "./config.js";
import Navigator from "./navigator.js";
import Ship from "./ship.js";
import Galaxy from "./galaxy.js";
import Perspective from "./perspective.js";
import DeltaReport from "./delta-report.js";

const config = new Config("html-canvas");

addEventListener("resize", () => config.resize());

const ship = new Ship(config, new Navigator());
const view = new Galaxy(config, ship, new Perspective());

// ----------------------------
// UPDATE
// ----------------------------
function update(timestamp) {    
    ship.update(); // ship moves 
    view.render(config.ctx); // stars & planets move & rendered
    ship.render(config.ctx); // ship on top
    requestAnimationFrame(update);
    DeltaReport.log(timestamp);
}
update(performance.now());