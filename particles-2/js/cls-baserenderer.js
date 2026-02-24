import { RendererRegistry } from "./cls-renderer-registry.js";

export default class BaseRenderer {
    static register(cls) {
        RendererRegistry[cls.type] = cls;
    }
}
