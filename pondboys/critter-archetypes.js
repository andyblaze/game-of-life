import { PredatorDrawing, PreyDrawing } from "./drawing-strategy.js";
import { PredatorMovement, PreyMovement } from "./movement-strategy.js";
import { PredatorPropulsion, PreyPropulsion } from "./propulsion-strategy.js";
import { PredatorLifespan, PreyLifespan } from "./lifespan-strategy.js";
import { PredatorSpawn, PreySpawn } from "./spawning-strategy.js";
import { PredatorInteraction, PreyInteraction } from "./interaction-strategy.js";

function makePredatorArchetype() {
    const pen = new PredatorDrawing();
    const mover = new PredatorMovement();
    const propeller = new PredatorPropulsion();
    const lifespan = new PredatorLifespan();
    const spawner = new PredatorSpawn();
    const interaction = new PredatorInteraction();

    return {
        draw: pen.draw.bind(pen),
        move: mover.move.bind(mover),
        propel: propeller.propel.bind(propeller),
        update: lifespan.update.bind(lifespan),
        spawn: spawner.spawn.bind(spawner),
        interact: interaction.interact.bind(interaction)
    };
}

function makePreyArchetype() {
    const pen = new PreyDrawing();
    const mover = new PreyMovement();
    const propeller = new PreyPropulsion();
    const lifespan = new PreyLifespan();
    const spawner = new PreySpawn();
    const interaction = new PreyInteraction();

    return {
        draw: pen.draw.bind(pen),
        move: mover.move.bind(mover),
        propel: propeller.propel.bind(propeller),
        update: lifespan.update.bind(lifespan),
        spawn: spawner.spawn.bind(spawner),
        interact: interaction.interact.bind(interaction)
    };
}

export default class CritterArchetypes {
    static types = {
        predator: makePredatorArchetype(),
        prey: makePreyArchetype()
    };
    static get(type) {
        return this.types[type];
    }    
}