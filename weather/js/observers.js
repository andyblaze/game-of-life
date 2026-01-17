
export class ConsoleObserver { 
    update(weather) {
        //console.log(weather);
    }
}

const cfg1 = {
    "temp":     { id: "#temp",       unit: "C",   suffix: "&deg; C" },
    "wind":     { id: "#wind-speed", unit: "MPH", suffix: " MPH" },
    "wind_dir": { id: "#wind-dir",   unit: "DEG", suffix: "&deg;" },
    "pressure": { id: "#pressure",   unit: "MB",  suffix: "MB" },
    "cloud":    { id: "#cloud",      unit: "PC",  suffix: "%" },
    "rain":     { id: "#rain",       unit: "INH", suffix: " &rdquo; / hr" }
};


const cfg2 = {
    "temp":     { id: "#temp",       unit: "C",   suffix: "&deg; C" },
    "wind":     { id: "#swind-speed", unit: "BEAUFORT", suffix: "" },
    "wind_dir": { id: "#wind-dir",   unit: "CARDINAL", suffix: "&deg;" },
    "pressure": { id: "#pressure",   unit: "MB",  suffix: "MB" },
    "cloud":    { id: "#cloud",      unit: "PC",  suffix: "%" },
    "rain":     { id: "#srain",       unit: "INH", suffix: " &rdquo; / hr" },
    "sea_state":      { id: "#sea",        unit: "TXT", suffix: ""},
    "visibility":      { id: "#vis",         unit: "TXT", suffix: "" }      
};

class HtmlRenderer {
    constructor(conf) {
        this.conf = conf;
    }
    output(state, index) { 
        const { id, unit, suffix } = { ...this.conf[index] }; 
        if ( index === "sea_state" && unit === "TXT" ) console.log(state[index], index, id, unit, suffix);
        const data = state[index][unit];
        $(id).html(data + suffix);
    }
    drawWindArrow(css) {
        $("#wind-arrow").css(css.key, css.var);
    }
}

export class Simpleton { 
    constructor() {
        this.state = {};
        this.renderer = new HtmlRenderer(cfg1);
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
export class Shipping {
    constructor() {
        this.state = {};
        this.renderer = new HtmlRenderer(cfg2);
    }
    update(readings) { 
        for ( const type in readings )
            this.state[type] = readings[type];
        this.render();
    }
    render() { 
        this.renderer.output(this.state, "pressure");
        this.renderer.output(this.state, "wind");
        this.renderer.output(this.state, "rain");
        this.renderer.output(this.state, "sea_state");
        this.renderer.output(this.state, "visibility");
    }
}
