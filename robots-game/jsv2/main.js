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
        this.cfg = cfg;
        this.ctx = cfg.ctx;
        this.renderers = [];
    }
    add(r) {
        this.renderers.push(r);
    }
    render(ctx, timers) {
        this.ctx.clearRect(0, 0, this.cfg.width, this.cfg.height);
        for ( const r of this.renderers ) {
            r.render(ctx, timers);
        }
    }
}

const renderers = new Renderers(config);
renderers.add(terrain);
renderers.add(unit);

class GameLoop {
    constructor(world, renderers, msgSystem, config) {
        this.world = world;
        this.renderers = renderers;
        this.msgSystem = msgSystem;
        this.config = config;

        this.t = 0;
        this.lastTime = 0;
        this.accumulator = 0;
        this.running = false;

        // bind once
        this._loop = this.loop.bind(this);
    }

    start() {
        if (this.running) return; // prevent double-start
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this._loop);
    }

    stop() {
        this.running = false;
    }

    loop(timestamp) {
        if (!this.running) return;

        const delta = timestamp - this.lastTime;
        const dt = delta / 1000;
        this.lastTime = timestamp;
        this.accumulator += delta;

        while (this.accumulator >= this.config.GAME_TICK_RATE) {
            this.world.tick();
            this.msgSystem.flush();
            this.accumulator -= this.config.GAME_TICK_RATE;
        }

        this.renderers.render(this.config.ctx, { noise: this.t, delta: dt });
        this.t += 0.002;

        requestAnimationFrame(this._loop);
    }
}

//const loop = new GameLoop(world, renderers, msgSystem, config);
//loop.start();

let t = 0;
let lastTime = 0;
let accumulator = 0;

function loop(timestamp) {
    const delta = timestamp - lastTime;
    const dt = delta / 1000;
    lastTime = timestamp;
    accumulator += delta;
    DeltaRreport.log(timestamp);

    // run game logic at fixed intervals
    while ( accumulator >= config.GAME_TICK_RATE ) {
        world.tick();
        msgSystem.flush();
        accumulator -= config.GAME_TICK_RATE;        
    }
    // rendering at full speed
    const timers = { noise: t, delta: dt };
    renderers.render(config.ctx, timers);
    t += 0.002;
    requestAnimationFrame(loop);
}

loop(performance.now());
