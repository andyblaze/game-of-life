export default class Scheduler {
    constructor(events) {
        console.log(events);
        this.steps = [
            0
        ];
        this.running = [];
    }
    triggersAt(seconds) {
        return (this.steps.indexOf(seconds) > -1 && this.running.indexOf(seconds) === -1);
    }
    launch(seconds) {
        this.running.push(seconds);
    }
}