
export class ConsoleObserver { 
    update(weather) {
        console.log(weather);
    }
}

export class Simpleton {
    constructor(c) {
        this.container = c;
        this.state = {};
    }
    update(readings) { console.log(readings); 
        this.state["temp"] = readings.temp.temp;
        this.render();
    }
    render() {
        this.container.html(this.state["temp"].C + "&deg; C");
    }        
}
