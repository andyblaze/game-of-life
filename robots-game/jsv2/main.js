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
import Spawner from "./spawner.js";
import UI from "./ui-controls.js";
import Renderers from "./util-classes/renderers.js";
import RafLoop from "./raf-loop.js";

const config = new Config("game-canvas");
const grid = new Grid(config);
const factory = new ObjectFactory(Registry, GameBalance, grid);
const hud = new HUD();
const msgSystem = new MessageSystem();
const world = new World(msgSystem);
const buildings = new BuildingSystem(world, factory);

const terrain = new Terrain(new TerrainGenerator(grid, config), new SimplexNoise());
const astar = new Astar(grid);

const ui = new UI(grid, config);

config.canvas.addEventListener("click", (e) => {
    ui.handleCanvasClick(e);
});

for ( const item of config.initialWorldItems ) {
    world.add(factory.create(item));
}

const spawn = new Spawner(grid, config, factory);

const humans = spawn.population("humans", config.initialHumanPop);
const robots = spawn.population("robots", config.initialRobotPop);
world.populate("humans", humans);
world.populate("robots", robots);

world.addObserver(hud);
msgSystem.addObserver(hud);

const renderers = new Renderers(config);
renderers.add(terrain); // add in Z index order, else things will get covered up !
renderers.add(humans);
renderers.add(buildings);
renderers.add(robots);

const loop = new RafLoop(world, renderers, msgSystem, config);
loop.start();
