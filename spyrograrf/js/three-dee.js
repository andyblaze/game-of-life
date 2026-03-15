export default class ThreeDee {
    constructor(cfg) {
        this.cfg = cfg;
        this.cameraAngle = 0;
        this.baseAlpha = 0.2;
        this.depthFactor = 0;//cfg.depthFactor;
        this.focalLength = 0;//cfg.focalLength; 
    }
    reset() {
        this.cameraAngle = 0;
        this.depthFactor = 0;//this.cfg.depthFactor;
        this.focalLength = 0;//this.cfg.focalLength;         
    }
    updateAngle() {
        this.cameraAngle += 0.002;
    }
    update(pos, rendererAlpha) {
        this.depthFactor = this.cfg.camera * 0.02;
        this.focalLength = this.cfg.camera * 300;
        if ( this.depthFactor === 0 || this.focalLength === 0 ) 
             return { x: pos.x, y: pos.y, a: rendererAlpha, prevAlpha: rendererAlpha };

        const tmpAlpha = rendererAlpha;
        
        const dx = pos.x - this.cfg.centerX;
        const dy = pos.y - this.cfg.centerY;

        // pseudo-z based on distance from center
        const z = Math.sqrt(dx*dx + dy*dy) * (this.depthFactor);

        // camera rotation around Y axis
        const angle = this.cameraAngle;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const xRot = dx * cosA - z * sinA;
        const zRot = dx * sinA + z * cosA;

        // perspective projection
        const focalLength = this.focalLength;
        const scale = focalLength / (focalLength + zRot);

        // final projected coordinates
        const xProj = this.cfg.centerX + xRot * scale;
        const yProj = this.cfg.centerY + dy * scale;

        // alpha fade based on z-depth
        const alpha = Math.min(1, this.baseAlpha * scale); // closer = brighter

        return { x: xProj, y: yProj, a: alpha, prevAlpha: tmpAlpha };
    }
}
