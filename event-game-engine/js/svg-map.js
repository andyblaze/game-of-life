export default class SvgMap {
  constructor(svgElement) {
    this.svg = svgElement;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.ready = this.load();
  }

  async load() {
    // 1. Read authoritative world size from viewBox
    const vb = this.svg.viewBox.baseVal;
    this.width  = vb.width;
    this.height = vb.height;
    this.canvas.width  = this.width;
    this.canvas.height = this.height;

    // 2. Serialize inline SVG → string
    const serializer = new XMLSerializer();
    const svgText = serializer.serializeToString(this.svg);

    // 3. Rasterize via Image
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.src = url;
    await img.decode();

    this.ctx.drawImage(img, 0, 0, this.width, this.height);
    URL.revokeObjectURL(url);
  }
  screenToWorld(evt) {
    const pt = this.svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(this.svg.getScreenCTM().inverse());
  }
}
