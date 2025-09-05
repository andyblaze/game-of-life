import * as Drawing from "./drawing-strategy.js";
import * as Movement from "./movement-strategy.js";
import * as Propulsion from "./propulsion-strategy.js";
import * as Lifespan from "./lifespan-strategy.js";
import * as Spawn from "./spawning-strategy.js";
import * as Interaction from "./interaction-strategy.js";

function makeArchetype(t) {
    const pen = new Drawing[t + "Drawing"]();
    const mover = new Movement[t + "Movement"]();
    const propeller = new Propulsion[t + "Propulsion"]();
    const lifespan = new Lifespan[t + "Lifespan"]();
    const spawner = new Spawn[t + "Spawn"]();
    const interaction = new Interaction[t + "Interaction"]();

    return {
        draw: pen.draw.bind(pen),
        move: mover.move.bind(mover),
        propel: propeller.propel.bind(propeller),
        update: lifespan.update.bind(lifespan),
        spawn: spawner.spawn.bind(spawner),
        interact: interaction.interact.bind(interaction)
    };
}


export default class Archetypes {
    static types = {};
    static get(type) {
        if ( ! (type in this.types) )
            this.types[type] = makeArchetype(type);
        return this.types[type];
    }    
}