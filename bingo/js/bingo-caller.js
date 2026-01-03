export default class BingoCaller {
  constructor(drawer, engine, numberTexts) {
    this.drawer = drawer; // instance of BingoBallDrawer
    this.engine = engine; // your GameEngine
    this.numberTexts = numberTexts || {}; // {1: "On its own 1", 22: "Two little ducks"}
    this.lastNumber = 0;
  }

  getLastNumber() {
    return this.lastNumber;
  }

  async drawNext() {
    if (!this.drawer.getRemaining().length) {
      console.log("All numbers drawn!");
      this.engine.dispatch("END_GAME");
      return;
    }

    // Enter DRAWING state
    this.engine.dispatch("DRAW");

    // Pick a number
    const number = this.drawer.draw();
    this.lastNumber = number; 

    // Show the “called” text
    const text = this.numberTexts[number] || number;
    console.log(`Number drawn: ${number} → "${text}"`);

    // Wait a human-like interval
    const delay = this.getHumanDelay(number);
    await this.sleep(delay);

    // Signal draw complete
    this.engine.dispatch("DRAW_COMPLETE");
  }

  getHumanDelay(number) {
    // Base 1–2.5 seconds per draw
    let base = 10 + Math.random() * 100;

    // Optional: longer for “special” numbers
    //if (this.numberTexts[number]) base += 500;

    return base;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
