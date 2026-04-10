import { WheatFarm, CoalMine, IronMine, WoodFarm } from "../buildings/farms.js";
import Bakery from "../buildings/bakery.js";
import PowerPlant from "../buildings/powerplant.js";
import { HumanPopulation, RobotPopulation } from "../populations.js";

export const Registry = {
    buildings: {
        wheat: WheatFarm,
        coal: CoalMine,
        iron: IronMine,
        wood: WoodFarm,
        bread: Bakery,
        power: PowerPlant
    },
    populations: {
        humans: HumanPopulation,
        robots: RobotPopulation
    }
};