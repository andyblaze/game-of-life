export default class BingoBallDrawer {
  constructor(min = 1, max = 75) {
    this.min = min;
    this.max = max;
    this.reset();
  }

  /* -----------------------------
     Shuffle helper (Fisher-Yates)
     ----------------------------- */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /* -----------------------------
     Reset the pool
     ----------------------------- */
  reset() {
    this.pool = [];
    for (let i = this.min; i <= this.max; i++) {
      this.pool.push(i);
    }
    this.shuffle(this.pool);
    this.drawn = [];
  }

  /* -----------------------------
     Draw one number
     ----------------------------- */
  draw() {
    if (this.pool.length === 0) {
      return null; // all numbers drawn
    }
    const number = this.pool.pop(); // last number after shuffle
    this.drawn.push(number);
    return number;
  }

  /* -----------------------------
     Draw all remaining numbers (for testing)
     ----------------------------- */
  drawAll() {
    const remaining = [];
    while (this.pool.length) {
      remaining.push(this.draw());
    }
    return remaining;
  }

  /* -----------------------------
     Peek at drawn numbers
     ----------------------------- */
  getDrawn() {
    return [...this.drawn];
  }

  /* -----------------------------
     Peek at remaining numbers
     ----------------------------- */
  getRemaining() {
    return [...this.pool];
  }
}
