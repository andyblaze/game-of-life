import TextSlider from "./textslider.js";
import TextMover from "./textmover.js";
import Underliner from "./underliner.js";
import TextRenderer from "./textrenderer.js";
import TransformScene from "./transform-scene.js";
import IntroScene from "./intro-scene.js";
import BlockSplitScene from "./blocksplit-scene.js";

export const AnimationRegistry = {
    [TextSlider.type]: TextSlider,
    [TextMover.type]: TextMover,
    [Underliner.type]: Underliner,
    [TextRenderer.type]: TextRenderer,
    [TransformScene.type]: TransformScene,
    [IntroScene.type]: IntroScene,
    [BlockSplitScene.type]: BlockSplitScene
};