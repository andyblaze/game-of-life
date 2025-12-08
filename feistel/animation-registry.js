import TextSlider from "./textslider.js";
import Underliner from "./underliner.js";
import TransformMediator from "./transform-mediator.js";
import IntroMediator from "./intro-mediator.js";
import TextRenderer from "./textrenderer.js";

export const AnimationRegistry = {
    [TextSlider.type]: TextSlider,
    [Underliner.type]: Underliner,
    [TextRenderer.type]: TextRenderer,
    [TransformMediator.type]: TransformMediator,
    [IntroMediator.type]: IntroMediator
};