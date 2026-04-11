import { Registry } from "./factory/registry.js";
import { GameBalance } from "./factory/game-balance.js";
import Config from "./config.js";
import ObjectFactory from "./factory/object-factory.js";
import MessageSystem from "./message-system.js";
import HUD from "./hud.js";
import World from "./world.js";
import BuildingSystem from "./buildings/building-system.js";
import Grid from "./grid/grid.js";
import Terrain from "./grid/terrain.js";
import TerrainGenerator from "./grid/terrain-generator.js";
import SimplexNoise from "./util-classes/simplex-noise.js";
import Astar from "./util-classes/a-star.js";
import Actor from "./units/actor.js";
import UI from "./ui-controls.js";
import Renderers from "./util-classes/renderers.js";
import RafLoop from "./raf-loop.js";

const config = new Config("game-canvas");
const factory = new ObjectFactory(Registry, GameBalance);
const hud = new HUD();
const msgSystem = new MessageSystem();
const world = new World(msgSystem);
const buildings = new BuildingSystem(world, factory);
const ui = new UI(buildings);

const grid = new Grid(config);
const terrain = new Terrain(new TerrainGenerator(grid, config), new SimplexNoise());
const astar = new Astar(grid);


for ( const item of config.initialWorldItems ) {
    world.add(factory.create(item));
}

class Spawner {
    constructor(grid, cfg) {
        this.grid = grid;
        this.cfg = cfg;
    }

    actors(n) {
        const tiles = this.grid.randomWalkableTiles(n);
        const actors = [];
        for ( const t of tiles ) {
            actors.push(new Actor(t, this.cfg.tileSize));
        } 
        return actors;
    }
}

const spawn = new Spawner(grid, config);

const humans = factory.createPopulation(
    "humans", 
    config.initialHumanPop, 
    spawn.actors(config.initialHumanPop)
);
const robots = factory.createPopulation(
    "robots",
    config.initialRobotPop,
    spawn.actors(config.initialRobotPop)
);
world.populate("humans", humans);
world.populate("robots", robots);

let panel = null;

config.canvas.addEventListener("click", (e) => {
    const rect = config.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tile = grid.getTileAtPixel(x, y);

    if (!tile) return;

    const size = { w: 200, h: 100 };

    // anchor to tile centre
    let px = tile.col * grid.tileSize + grid.tileSize / 2 + 10;
    let py = tile.row * grid.tileSize + grid.tileSize / 2 + 10;

    // flip if overflowing right
    if (px + size.w > config.width) {
        px = tile.col * grid.tileSize - size.w - 10;
    }

    // flip if overflowing bottom
    if (py + size.h > config.height) {
        py = tile.row * grid.tileSize - size.h - 10;
    }

    const p = document.getElementById("game-panel");
    p.style.left = px + "px";
    p.style.top = py + "px";
    p.style.display = "block";
});

world.addObserver(hud);
msgSystem.addObserver(hud);

const renderers = new Renderers(config);
renderers.add(terrain); // add in Z index order, else things will get covered up !
renderers.add(humans);
renderers.add(robots);

const loop = new RafLoop(world, renderers, msgSystem, config);
loop.start();
