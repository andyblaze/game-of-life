
export class ConsoleObserver { 
    update(weather) {
        console.log(weather);
    }
}

const cfg = {
    "temp":     { id: "#temp",       unit: "C",   suffix: "&deg; C" },
    "wind":     { id: "#wind-speed", unit: "MPH", suffix: " MPH" },
    "wind_dir": { id: "#wind-dir",   unit: "DEG", suffix: "&deg;" },
    "pressure": { id: "#pressure",   unit: "MB",  suffix: "MB" },
    "cloud":    { id: "#cloud",      unit: "PC",  suffix: "%" },
    "rain":     { id: "#rain",       unit: "INH", suffix: " &rdquo; / hr" }
};

class HtmlRenderer {
    output(state, index) {
        const { id, unit, suffix } = { ...cfg[index] };
        const data = state[index][unit];
        $(id).html(data + suffix);
    }
    drawWindArrow(css) {
        $("#wind-arrow").css(css.key, css.var);
    }
}

export class Simpleton { 
    constructor(c) {
        this.container = c; 
        this.state = {};
        this.renderer = new HtmlRenderer();
    }
    update(readings) { 
        for ( const type in readings )
            this.state[type] = readings[type];
        this.render();
    }
    render() { 
        this.renderer.output(this.state, "temp");
        this.renderer.output(this.state, "wind");
        this.renderer.output(this.state, "cloud");
        this.renderer.output(this.state, "rain");
        this.renderer.output(this.state, "wind_dir");
        this.renderer.drawWindArrow({ key: "transform", var: `rotate(${this.state["wind_dir"].DEG}deg)` });
    }        
}
