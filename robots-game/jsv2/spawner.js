import Actor from "./units/actor.js";

export default class Spawner {
    constructor(grid, cfg, factory) {
        this.grid = grid;
        this.cfg = cfg;
        this.factory = factory;
    }

    actors(n) {
        const tiles = this.grid.randomWalkableTiles(n);
        const actors = [];
        for ( const t of tiles ) {
            actors.push(new Actor(t));
        } 
        return actors;
    }
    population(type, n) {
        return this.factory.createPopulation(type, n, this.actors(n));
    }
}