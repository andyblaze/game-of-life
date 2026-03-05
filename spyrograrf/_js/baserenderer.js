import { RendererRegistry } from "./renderer-registry.js";

export default class BaseRenderer {
    static register(cls) {
        RendererRegistry[cls.type] = cls;
    }
}
