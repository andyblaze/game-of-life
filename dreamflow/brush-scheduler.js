
class BrushScheduler {
    constructor(brushes, nb) {
        this.brushes = brushes;
        this.nullBrush = nb;
        this.current = 0;
        this.isResting = false;
    }
    intermission() {
        if ( this.nullBrush.expired() ) {
            this.nullBrush.reset();
            this.isResting = false;
        } else {
            this.nullBrush.update();
        }
    }
    update(dt, df) {
        if ( this.isResting ) {
            this.intermission();
            return;
        }
        const brush = this.brushes[this.current];
        brush.update(dt, df);

        if ( brush.expired() ) {
            brush.reset();
            this.current = (this.current + 1) % this.brushes.length;
            this.isResting = true; // trigger a short null pause
        }
    }
}