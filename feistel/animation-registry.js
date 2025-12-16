import TextSlider from "./text-slider.js";
import TextMover from "./text-mover.js";
import Underliner from "./underliner.js";
import TokenRenderer from "./token-renderer.js";
import TextRenderer from "./text-renderer.js";
import TextHiliter from "./text-hiliter.js";
import TransformScene from "./transform-scene.js";
import IntroScene from "./intro-scene.js";
import BlockSplitScene from "./blocksplit-scene.js";
import FeistelRoundDirector from "./feistel-round-director.js";

export const AnimationRegistry = {
    [TextSlider.type]: TextSlider,
    [TextMover.type]: TextMover,
    [Underliner.type]: Underliner,
    [TokenRenderer.type]: TokenRenderer,
    [TextRenderer.type]: TextRenderer,
    [TextHiliter.type]: TextHiliter,
    [TransformScene.type]: TransformScene,
    [IntroScene.type]: IntroScene,
    [BlockSplitScene.type]: BlockSplitScene,
    [FeistelRoundDirector.type]: FeistelRoundDirector
};