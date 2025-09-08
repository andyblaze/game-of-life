import { clamp } from "./functions.js";
import Config from "./config.js";

class InteractionStrategy {
    interact(self, other) { } 
}

export class Type1Interaction extends InteractionStrategy {
    interact(self, other) { console.log(self);
        //let l = other.stars.length;
        if ( self.settled === true ) {
            other.addStar(self.toStar(Config.global()));
            //console.log(self.toStar(Config.global()), other.stars[0]);
        }
        
    }
}

export class Type2Interaction extends InteractionStrategy {
    interact(self, other) {
        
    }
}
export class Type3Interaction extends InteractionStrategy {
    interact(self, other) {
        
    }
}