import TextSlider from "./textslider.js";
import Underliner from "./underliner.js";

export const AnimationRegistry = {
    [TextSlider.type]: TextSlider,
    [Underliner.type]: Underliner
    //[VerticalTextSlider.type]:VerticalTextSlider
    //[FadeIn.type]: FadeIn
};