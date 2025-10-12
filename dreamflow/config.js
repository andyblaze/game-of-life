const onscreen = document.getElementById("onscreen");
const onCtx = onscreen.getContext("2d", { alpha: false });

const offscreen = document.createElement("canvas");
const offCtx = offscreen.getContext("2d");


const gridWIn = document.getElementById('gridW');
const gridHIn = document.getElementById('gridH');

const diff = document.getElementById('dif');
const adv = document.getElementById('adv');
const damp = document.getElementById('dmp');
const exc = document.getElementById('exc');
const fade = document.getElementById('fde');



// Simulation parameters (start values)
const config = {  
    W: parseInt(gridWIn.value,10), 
    H: parseInt(gridHIn.value,10),
    diffusion: parseFloat(diff.value)/100,
    advection: parseFloat(adv.value)/100,
    damping: parseFloat(damp.value)/1000,
    excitationRate: parseFloat(exc.value),
    fadeStrength: parseFloat(fade.value)/100,
    onscreenCanvas: onscreen,
    "onCtx": onCtx,
    offscreenCanvas: offscreen,
    "offCtx": offCtx
};
export default config;