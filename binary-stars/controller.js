import DeltaReport from "./delta-report.js";

export default class Controller {    
    constructor(m, v, c) {
        this.model = m;
        this.view = v;
        this.cfg = c;
        this.last = performance.now();
        this.animate = this.animate.bind(this); // <— bind once here
    }
    delta(a, b) {
        const dt = (a - b) / 1000; // ms → s
        return Math.max(0, Math.min(0.05, dt));
    }
    animate(now) {
        const dt = this.delta(now, this.last);
        this.last = now;        
        const data = this.model.update(dt);
        this.view.draw(data);
        DeltaReport.log(now);
        requestAnimationFrame(this.animate);
    }
}