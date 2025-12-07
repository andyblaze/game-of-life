import TextSlider from "./textslider.js";
import Underliner from "./underliner.js";
import TransformMediator from "./transform-mediator.js";
import IntroMediator from "./intro-mediator.js";

export const AnimationRegistry = {
    [TextSlider.type]: TextSlider,
    [Underliner.type]: Underliner,
    [TransformMediator.type]: TransformMediator,
    [IntroMediator.type]: IntroMediator
    //[VerticalTextSlider.type]:VerticalTextSlider
    //[FadeIn.type]: FadeIn
};