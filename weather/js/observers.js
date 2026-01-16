
export class ConsoleObserver { 
    update(weather) {
        //console.log(weather);
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
    output90(id, data, suffix) {
        const htm = data + suffix;
        $(id).html(htm);
    }
    output(state, index) {
        const { id, unit, suffix } = { ...cfg[index] };
        const data = state[index][unit];
        $(id).html(data + suffix);
        //this.output(id, data, suffix);
    }
    drawWindArrow(css) {
        $("#wind-arrow").css(css.key, css.var);
    }
}

export class Simpleton { 
    constructor(c) {
        this.container = c; //console.log(this.container);
        this.state = {};
        this.renderer = new HtmlRenderer();
    }
    update(readings) { 
        for ( const type in readings )
            this.state[type] = readings[type];
        //console.log("state", this.state); 
        //this.state["temp"] = readings.temp.temp;
        this.render();
    }
    render() { 
        this.renderer.output(this.state, "temp");
        this.renderer.output(this.state, "wind");
        this.renderer.output(this.state, "cloud");
        this.renderer.output(this.state, "rain");
        this.renderer.output(this.state, "wind_dir");
        //this.container.find("#temp").html(this.state["temp"].C + "&deg; C");
       // this.container.find("#wind-speed").html(this.state["wind"].MPH + " MPH");
       // this.container.find("#wind-dir").html(this.state["wind_dir"].DEG + "&deg;");
        //this.container.find("#cloud").html(this.state["cloud"].PC + "%");
        //this.container.find("#rain").html(this.state["rain"].INH + " Inches per hour");
        this.renderer.drawWindArrow({ key: "transform", var: `rotate(${this.state["wind_dir"].DEG}deg)` });
        //.css(,);
    }        
}
