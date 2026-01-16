
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
        this.container.html(this.state["temp"].C + "&deg; C");
    }        
}
