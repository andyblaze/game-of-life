import SeaSystem from "./sea-system.js";
import WeatherSystem from "./weather-system.js";
import PeopleSystem from "./people-system.js";
import FishSystem from "./fish-system.js";
import LandSystem from "./land-system.js";
import Mood from "./mood.js";
import SeaColor from "./sea-color.js";

export function createCoreSystems(eventBus, config) {
    return [
        new SeaSystem(eventBus, config.sea_messages),
        new WeatherSystem(eventBus, config.weather_messages),
        new PeopleSystem(eventBus, config.people_messages),
        new FishSystem(eventBus, config.fish_messages),
        new LandSystem(eventBus, config.land_messages),
        new SeaColor(eventBus, config.sea_change),
        new Mood(eventBus, config.moods)
    ];
}