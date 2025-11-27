export default class Scheduler {
    constructor() {
        this.steps = [
            0
        ];
        this.running = [];
    }
    triggerAt(seconds) {
        const launched = (this.running.indexOf(seconds) === -1);
        if ( false === launched && this.steps.indexOf(seconds) !== -1 ) {
            this.running.push(seconds);
        }
        return launched === false;
    }
}