
export class ConsoleObserver { 
    update(weather) {
        //console.log(weather);
    }
}

export class Simpleton { 
    constructor(c) {
        this.container = c; //console.log(this.container);
        this.state = {};
    }
    update(readings) { 
        for ( const type in readings )
            this.state[type] = readings[type];
        //console.log("state", this.state); 
        //this.state["temp"] = readings.temp.temp;
        this.render();
    }
    render() { 
        this.container.find("#temp").html(this.state["temp"].C + "&deg; C");
        this.container.find("#wind-speed").html(this.state["wind"].MPH + " MPH");
        this.container.find("#wind-dir").html(this.state["wind_dir"].DEG + "&deg;");
        this.container.find("#cloud").html(this.state["cloud"].PC + "%");
        this.container.find("#rain").html(this.state["rain"].INH + " Inches per hour");
    }        
}
