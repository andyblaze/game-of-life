import Lane from "./lane.js";

export default class Model {
    constructor(cfg) {
        this.cfg = cfg;
        this.maxActiveLanes = cfg.maxMainDrops;
        this.activeLanes = [];
        this.lanes = this.initLanes(cfg.laneCount, cfg.charWidth);
    } 
    initLanes(num, charWidth) {
        return Array.from({ length: num }, (_, i) =>
            new Lane(i * charWidth + charWidth / 2, this.cfg)
        );
    }
    updateLanes() {
        this.activeLanes = this.activeLanes.filter(idx => {
            this.lanes[idx].update();
            return this.lanes[idx].hasDrops(); // keep only lanes that still have drops
        });
    }
    getEmptyLaneIndex() {
        // pick a random lane not already active
        const available = this.lanes
            .map((lane, idx) => idx)
            .filter(idx => ! this.activeLanes.includes(idx));
        const laneIndex = available[Math.floor(Math.random() * available.length)];
        return laneIndex;
    }
    tick() {
        const laneIndex = this.getEmptyLaneIndex();
        this.activeLanes.push(laneIndex);
        const canSpawn = (this.activeLanes.length < this.maxActiveLanes); 
        this.lanes.forEach(lane => lane.update(canSpawn));
        this.updateLanes();
        return this.lanes;
    }
}
