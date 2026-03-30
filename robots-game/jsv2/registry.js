import { WheatFarm, CoalMine, IronMine, WoodFarm } from "./farms.js";
import Bakery from "./bakery.js";
import PowerPlant from "./powerplant.js";

export const Registry = {
    wheat: WheatFarm,
    coal: CoalMine,
    iron: IronMine,
    wood: WoodFarm,
    bread: Bakery,
    power: PowerPlant
};