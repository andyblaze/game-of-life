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
    population(type, n) {
        return factory.createPopulation(type, n, this.actors(n));
    }
}

const spawn = new Spawner(grid, config);

const humans = spawn.population("humans", config.initialHumanPop);
const robots = spawn.population("robots", config.initialRobotPop);
world.populate("humans", humans);
world.populate("robots", robots);

class UiPanel {
    constructor(id) {
        this.panel = document.getElementById(id);
        this.visible = false;
        this.px = 0;
        this.py = 0;
    }
    getSize() {
        return { w: parseInt(this.panel.style.width), h: parseInt(this.panel.style.height) };
    }
    setOffset(tile, grid, cfg) {
        const size = this.getSize();
        // anchor to tile centre
        this.px = tile.col * grid.tileSize + grid.tileSize / 2 + 10;
        this.py = tile.row * grid.tileSize + grid.tileSize / 2 + 10;

        // flip if overflowing right
        if (this.px + size.w > cfg.width) {
            this.px = tile.col * grid.tileSize - size.w - 10;
        }

        // flip if overflowing bottom
        if (this.py + size.h > cfg.height) {
            this.py = tile.row * grid.tileSize - size.h - 10;
        }        
    }
    setStyle(l, t, d) {
        this.panel.style.left = l;
        this.panel.style.top = t;
        this.panel.style.display = d;
        this.visible = (d === "block");
    }
}

config.canvas.addEventListener("click", (e) => {
    const rect = config.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tile = grid.getTileAtPixel(x, y);

    if (!tile) return;

    const panel = new UiPanel("game-panel");
    document.getElementById("tile-type").innerText = tile.type;

    const size = panel.getSize();

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

    if ( panel.visible ) {
        panel.setStyle("0px", "0px", "none");
    }
    else {
        panel.setStyle(`${px}px`, `${py}px`, "block");
    }
});

world.addObserver(hud);
msgSystem.addObserver(hud);

const renderers = new Renderers(config);
renderers.add(terrain); // add in Z index order, else things will get covered up !
renderers.add(humans);
renderers.add(robots);

const loop = new RafLoop(world, renderers, msgSystem, config);
loop.start();
