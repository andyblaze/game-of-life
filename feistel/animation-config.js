
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
            {type:"textRenderer", eventId:"transformed_plaintext", config:{"x":40, "y": 128}}
        ]       
    } } 
];
