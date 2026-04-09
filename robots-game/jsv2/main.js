import { Registry } from "./registry.js";
import { GameBalance } from "./game-balance.js";
import Config from "./config.js";
import ObjectFactory from "./object-factory.js";
import MessageSystem from "./message-system.js";
import HUD from "./hud.js";
import World from "./world.js";
import DeltaRreport from "./delta-report.js";
import BuildingSystem from "./building-system.js";
import Grid from "./grid.js";
import Terrain from "./terrain.js";
import TerrainGenerator from "./terrain-generator.js";
import SimplexNoise from "./simplex-noise.js";
import Astar from "./a-star.js";
import Unit from "./unit.js";
import UI from "./ui-controls.js";

const config = new Config("game-canvas");
const factory = new ObjectFactory(Registry, GameBalance);
const hud = new HUD();
const msgSystem = new MessageSystem();
const world = new World(msgSystem);
const buildings = new BuildingSystem(world, factory);
const ui = new UI(buildings);

/* new */
const grid = new Grid(config);
const terrain = new Terrain(new TerrainGenerator(grid, config), new SimplexNoise());
const astar = new Astar(grid);
const unit = new Unit(grid.tileAt(0, 0), config.tileSize); // top-left tile

config.canvas.addEventListener("click", (e) => {
    const rect = config.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const destTile = grid.getTileAtPixel(x, y);

    if (!destTile) return;
    if (!destTile.walkable) {
        console.log("Destination blocked!");
        return;
    }

    // Compute path from unit.tile → destTile
    const path = astar.findPath(unit.tile, destTile);
    if (path.length === 0) {
        console.log("No path found!");
        return;
    }

    // Assign path to the unit
    unit.path = path;
    unit.pathIndex = 0;
});

/* end new */

for ( const item of config.initialWorldItems ) {
    world.add(factory.create(item));
}

world.populate("humans", factory.createPopulation("humans", config.initialHumanPop));
world.populate("robots", factory.createPopulation("robots", config.initialRobotPop));
world.addObserver(hud);
msgSystem.addObserver(hud);

//ui.buttons(".farm-btn"); 

class Renderers {
    constructor(cfg) {
        this.ctx = cfg.ctx;
        this.t = 0;
        this.renderers = [];
    }
    add(r) {
        this.renderers.push(r);
    }
    render(ctx, dt) {
        ctx.clearRect(0, 0, config.width, config.height);
        for ( const r of this.renderers ) {
            r.render();
        }
        this.t += 0.002;
    }
}

let t = 0;
let lastTime = 0;
let accumulator = 0;
const TICK_RATE = 1000; // ms per game tick  

function loop(timestamp) {
    const delta = timestamp - lastTime;
    const dt = delta / 1000;
    lastTime = timestamp;
    accumulator += delta;
    DeltaRreport.log(timestamp);

    // run game logic at fixed intervals
    while ( accumulator >= TICK_RATE ) {
        world.tick();
        msgSystem.flush();
        accumulator -= TICK_RATE;        
    }
    // rendering at full speed
    config.ctx.clearRect(0, 0, config.width, config.height);
    terrain.render(config.ctx, { use: t, dont: dt });
    unit.render(config.ctx, { use: dt, dont: t} );
    t += 0.002;
    requestAnimationFrame(loop);
}

loop(performance.now());
