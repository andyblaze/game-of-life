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

/* new */
const grid = new Grid(config);
const terrain = new Terrain(new TerrainGenerator(grid, config), new SimplexNoise());
const astar = new Astar(grid);
const unit = new Actor(config.tileSize); 
unit.setTile(grid.tileAt(0,0));

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

class Spawner {
    constructor(grid) {
        this.grid = grid;
    }

    getSpawnTiles(n) {
        return this.grid.randomWalkableTiles(n);
    }
}

const spawner = new Spawner(grid);
const tiles = spawner.getSpawnTiles(config.initialHumanPop);
const humans = factory.createPopulation("humans", config.initialHumanPop, tiles);
world.populate("humans", humans);

//world.populate("humans", factory.createPopulation("humans", config.initialHumanPop));
world.populate("robots", factory.createPopulation("robots", config.initialRobotPop));
world.addObserver(hud);
msgSystem.addObserver(hud);

const renderers = new Renderers(config);
renderers.add(terrain); // add in Z index order, else things will get covered up !
renderers.add(unit);

const loop = new RafLoop(world, renderers, msgSystem, config);
loop.start();
