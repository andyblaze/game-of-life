// ---------------------
// Simple 2D Perlin Noise
// ---------------------
export default class Perlin {
  constructor() {
    this.p = new Uint8Array(512);
    for (let i = 0; i < 256; ++i) this.p[i] = i;
    for (let i = 0; i < 256; ++i) {
      let r = i + Math.floor(Math.random() * (256 - i));
      [this.p[i], this.p[r]] = [this.p[r], this.p[i]];
    }
    for (let i = 0; i < 256; ++i) this.p[i+256] = this.p[i];
  }
  fade(t) { return t*t*t*(t*(t*6-15)+10); }
  lerp(a,b,t) { return a + t*(b-a); }
  grad(hash, x, y) {
    switch(hash & 3) {
      case 0: return  x + y;
      case 1: return -x + y;
      case 2: return  x - y;
      case 3: return -x - y;
    }
  }
  noise(x,y) {
    let X = Math.floor(x)&255;
    let Y = Math.floor(y)&255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    let u=this.fade(x), v=this.fade(y);
    let A=this.p[X]+Y, B=this.p[X+1]+Y;
    return this.lerp(
      this.lerp(this.grad(this.p[A], x, y),
                this.grad(this.p[B], x-1, y), u),
      this.lerp(this.grad(this.p[A+1], x, y-1),
                this.grad(this.p[B+1], x-1, y-1), u),
      v);
  }
}