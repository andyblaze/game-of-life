export default class BingoCaller {
  constructor(drawer, engine, numberTexts) {
    this.drawer = drawer; // instance of BingoBallDrawer
    this.engine = engine; // your GameEngine
    this.numberTexts = numberTexts; 
    this.lastNumber = 0;
  }

  getLastNumber() {
    return this.lastNumber;
  }

  async drawNext() {
    if ( !this.drawer.getRemaining().length ) {
      this.engine.dispatch("END_GAME");
      return;
    }
    this.engine.dispatch("DRAW");

    // Pick a number
    const number = this.drawer.draw();
    this.lastNumber = number; 

    // Show the “called” text
    const text = this.numberTexts[number];
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
    return base;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
