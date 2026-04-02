import { WheatFarm, CoalMine, IronMine, WoodFarm } from "./farms.js";
import Bakery from "./bakery.js";
import PowerPlant from "./powerplant.js";
import { HumanPopulation, RobotPopulation } from "./populations.js";

export const Registry = {
    wheat: WheatFarm,
    coal: CoalMine,
    iron: IronMine,
    wood: WoodFarm,
    bread: Bakery,
    power: PowerPlant,
    populations: {
        humans: HumanPopulation,
        robots: RobotPopulation
    }
};