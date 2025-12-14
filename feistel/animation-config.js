
export const animationConfig = [
    { type: "introScene", "config": {
        direction: "encrypt",
        actors:[
            {type:"textSlider", eventId:"alphabet", config:{"speed": 1, "x": "mid", "endAt":60, "axis": "vertical"}},
            {type:"textSlider", eventId:"indices", config:{"speed": 1, "x": "mid", "endAt":88, "axis": "vertical"}},
            {type:"textSlider", eventId:"plaintext", config:{"speed": -4, "y":20}}
        ]
    } }, 
    { type: "transformScene", "config": {
        direction: "encrypt", stepTime:300, holdTime:300,
        actors:[
            {type:"underliner", eventId:"plaintext", config:{}},
            {type:"underliner", eventId:"alphabet", config:{}},
            {type:"underliner", eventId:"indices", config:{}},
            {type:"tokenRenderer", eventId:"transformed_plaintext", config:{"x":40, "y": 128}}
        ]       
    } },
    { type: "blocksplitScene", "config": {
        direction: "encrypt", eventId:"block_split", layout: "transformed_plaintext",
        actors:[
            {type:"textMover", eventId:"block_split_left",  config:{target:{"x": 40, "y": 128}, speed: 0.05}},
            {type:"textMover", eventId:"block_split_right", config:{target:{"x": 40, "y": 158}, speed: 0.05}}
        ]       
    } }, 
    { type: "feistelRoundDirector", "config": {
        direction: "encrypt", eventId:"round_order",
        actors:[
            {type:"textHiliter", eventId:"round_order",  config:{"x": 40, "y": 228, "hiliteIndex": 2, "separator": ", "}}
        ]       
    } } 
];
