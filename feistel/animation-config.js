
export const animationConfig = [
    { time: 0, fired:false, type: "introMediator", "config": {
        direction: "encrypt",
        actors:[
            {type:"textSlider", eventId:"alphabet", config:{"speed": 1, "x": "mid", "endAt":60, "axis": "vertical"}},
            {type:"textSlider", eventId:"indices", config:{"speed": 1, "x": "mid", "endAt":88, "axis": "vertical"}},
            {type:"textSlider", eventId:"plaintext", config:{"speed": -4, "y":20}}
        ]
    } }, //"speed": 1, "x": "mid", "endAt":60, "axis": "vertical"} },
    //{ time: 0, fired:false, type: "iMediator", "config": {} }, //"speed": 1, "x": "mid", "endAt":60, "axis": "vertical"} },
    //{ time: 1, fired:false, type: "textSlider", "config": {"speed": 1, "x": "mid", "endAt":88, "axis": "vertical"} },
    //{ time: 2, fired:false, type: "textSlider", "config": {"speed": -4, "y":20} },
    { time: 3, fired:false, type: "ttMediator", "config": {} } /*,
    { t: 7,  type: "xorRound",     data: visitor.round0_xor },
    { t: 9,  type: "swap",         data: visitor.after_swap0 },
    { t: 12, type: "xorRound",     data: visitor.round1_xor },
    ...*/
];

export const timingFor = [
    0,
    1,
    2,
    9
];