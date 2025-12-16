import { isNumeric } from "./functions.js";
import Animation from "./animation.js";
import TextRenderer from "./text-renderer.js";

export default class TextSlider extends TextRenderer {
    static type = "textSlider";
    constructor(cnvs, event, cfg) {
        super(cnvs, event, cfg);
        this.axis = cfg.axis || "horizontal"; // "horizontal" or "vertical"
        this.speed = cfg.speed;     // sign determines direction
        this.setFixed(cfg);
        this.setTarget(cfg); 
        this.setPosition(cfg);
    }
    normalizePos(value, dimension=null) {
        if ( null === dimension ) dimension = this.axis;
        if (isNumeric(value)) return parseInt(value);

        // defaults for each axis
        const map = {
            "left":   0,
            "top":    0,
            "mid":    (dimension === "horizontal"
                      ? Math.floor(( this.canvas.width  -  this.textSz.width ) / 2)
                      : Math.floor(( this.canvas.height -  this.textSz.height) / 2)),
            "right":   this.canvas.width  -  this.textSz.width,
            "bottom":  this.canvas.height -  this.textSz.height
        };

        if (map.hasOwnProperty(value)) return map[value];
        // default to "mid"
        return map.mid;
    }
    setFixed(cfg) {
        // For horizontal, fixed = y
        if (this.axis === "horizontal")
            this.fixed = this.normalizePos(cfg.y, "vertical");
        // For vertical, fixed = x
        else
            this.fixed = this.normalizePos(cfg.x, "horizontal");
    }
    setPosition(cfg) {
        // Try to use user-provided numeric or keyword position
        const userPos = (this.axis === "horizontal"
            ? cfg.x
            : cfg.y
        );        
        if ( userPos === undefined ) { // Default: start fully off-screen
            const size = (this.axis === "horizontal" ? this.textSz.width  : this.textSz.height);
            const max  = (this.axis === "horizontal" ? this.canvas.width : this.canvas.height);

            this.position = (this.speed > 0)
                ? -size   // enter from left/top
                : max;    // enter from right/bottom
        }
        else { // If user gave something, normalize it
            this.position = this.normalizePos(userPos);            
        }
    }
    setTarget(cfg) {
        this.target = this.normalizePos(cfg.endAt);
    }    
    draw(x, y) {
        if ( this.axis === "vertical" )
            [x, y] = [y, x];
        this.ctx.fillText(this.msg, x, y);
    }
    run(dt, elapsedSeconds) {
        if ( false === this.started || true === this.animationDone) {
            this.draw(this.position, this.fixed);
            return;
        }
        // Move toward target
        const step = this.to60Fps(this.speed, dt);
        this.position += step;
        // Stop at target
        const reached = 
            (this.speed > 0 && this.position >= this.target) ||
            (this.speed < 0 && this.position <= this.target);
        // If done, return early
        if ( reached ) {
            this.position = this.target;
            this.draw(this.position, this.fixed);
            this.registerLayout();
            this.animationDone = true;
            this.onComplete();
            return;
        }
        this.draw(this.position, this.fixed);
    }
}
