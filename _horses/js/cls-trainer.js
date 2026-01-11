import AttributeFactory from "./cls-attributes-factory.js";

export default class Trainer {
    static type = "trainers";
  constructor(id, config, name) {
    this.id = id;
    this.name = name;

    // Hidden attributes
    this.attributes = AttributeFactory.generate(config.attributes);//this.generateAttributes(config.attributes);

    // Stable of horse IDs (empty at creation)
    this.stable = [];
  }
  // Add a horse to this trainer's stable
  addHorse(horse) {
    this.stable.push(horse.id);
    horse.trainerId = this.id;
  }
}
