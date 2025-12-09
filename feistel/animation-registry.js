import TextSlider from "./textslider.js";
import Underliner from "./underliner.js";
import TransformScene from "./transform-scene.js";
import IntroScene from "./intro-scene.js";
import TextRenderer from "./textrenderer.js";

export const AnimationRegistry = {
    [TextSlider.type]: TextSlider,
    [Underliner.type]: Underliner,
    [TextRenderer.type]: TextRenderer,
    [TransformScene.type]: TransformScene,
    [IntroScene.type]: IntroScene
};