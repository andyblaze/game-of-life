import { PredatorDrawing, PreyDrawing } from "./drawing-strategy.js";
import { PredatorMovement, PreyMovement } from "./movement-strategy.js";
import { PredatorPropulsion, PreyPropulsion } from "./propulsion-strategy.js";
import { PredatorLifespan, PreyLifespan } from "./lifespan-strategy.js";
import { PredatorSpawn, PreySpawn } from "./spawning-strategy.js";
import { PredatorInteraction, PreyInteraction } from "./interaction-strategy.js";

function makePredatorArchetype() {
    const draw = new PredatorDrawing();
    const move = new PredatorMovement();
    const propel = new PredatorPropulsion();
    const update = new PredatorLifespan();
    const spawn = new PredatorSpawn();
    const interact = new PredatorInteraction();

    return {
        draw: draw.draw.bind(draw),
        move: move.move.bind(move),
        propel: propel.propel.bind(propel),
        update: update.update.bind(update),
        spawn: spawn.spawn.bind(spawn),
        interact: interact.interact.bind(interact)
    };
}

function makePreyArchetype() {
    const draw = new PreyDrawing();
    const move = new PreyMovement();
    const propel = new PreyPropulsion();
    const update = new PreyLifespan();
    const spawn = new PreySpawn();
    const interact = new PreyInteraction();

    return {
        draw: draw.draw.bind(draw),
        move: move.move.bind(move),
        propel: propel.propel.bind(propel),
        update: update.update.bind(update),
        spawn: spawn.spawn.bind(spawn),
        interact: interact.interact.bind(interact)
    };
}

/*const predatorDrawing = new PredatorDrawing();
const preyDrawing = new PreyDrawing();
const predatorMovement = new PredatorMovement();
const preyMovement = new PreyMovement();
const predatorPropulsion = new PredatorPropulsion();
const preyPropulsion = new PreyPropulsion();
const predatorLifespan = new PredatorLifespan();
const preyLifespan = new PreyLifespan();
const predatorSpawn = new PredatorSpawn();
const preySpawn = new PreySpawn();
const predatorInteraction = new PredatorInteraction();
const preyInteraction = new PreyInteraction();*/

export default class CritterArchetypes {
    static types = {
        predator: makePredatorArchetype(),
        prey: makePreyArchetype()
    };
    static get(type) {
        return this.types[type];
    }    
}