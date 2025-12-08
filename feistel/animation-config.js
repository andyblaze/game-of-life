
export const animationConfig = [
    { time: 0, fired:false, type: "introMediator", "config": {
        direction: "encrypt",
        actors:[
            {type:"textSlider", eventId:"alphabet", config:{"speed": 1, "x": "mid", "endAt":60, "axis": "vertical"}},
            {type:"textSlider", eventId:"indices", config:{"speed": 1, "x": "mid", "endAt":88, "axis": "vertical"}},
            {type:"textSlider", eventId:"plaintext", config:{"speed": -4, "y":20}}
        ]
    } }, 
    { time: 3, fired:false, type: "ttMediator", "config": {
        direction: "encrypt", stepTime:300, holdTime:300,
        actors:[
            {type:"underliner", eventId:"plaintext", config:{}},
            {type:"underliner", eventId:"alphabet", config:{}},
            {type:"underliner", eventId:"indices", config:{}},
            {type:"textRenderer", eventId:"transformed_plaintext", config:{"x":40, "y": 128}}
        ]       
    } } 
];

export const timingFor = [
    0,
    1,
    2,
    9
];