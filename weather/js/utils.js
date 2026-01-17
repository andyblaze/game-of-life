export class RollingBuffer {
    constructor(size) {
        this.size = size;
        this.data = Array.from({ length: size });
    }
    add(item) {
       if ( this.data.length >= this.size )
            this.data.pop();
        this.data.unshift(item);
    }
    getData() {
        return this.data;
    }
}