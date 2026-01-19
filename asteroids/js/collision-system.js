export default class CollisionSystem {
  constructor(entities) {
    this.entities = entities;
  }

  update() {
    const list = this.entities;

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];

        if (a.collidesWith && b.collidesWith) {
          if (a.collidesWith(b)) {
            a.onCollision(b);
            b.onCollision(a);
          }
        }
      }
    }
  }
}
