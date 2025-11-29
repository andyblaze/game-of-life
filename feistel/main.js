import { byId, addEvent } from "./functions.js";
import FeistelVisitor from "./visitor.js";
import FeistelNetwork from "./feistel.js";
import { Animator } from "./animator.js";
import Scheduler from "./scheduler.js";

const onscreen = byId("onscreen");
const onCtx = onscreen.getContext("2d");
onscreen.width = window.innerWidth;
onscreen.height = window.innerHeight;
onscreen.style.width = window.innerWidth;
onscreen.style.height = window.innerHeight;

onCtx.font = "19px monospace";
onCtx.fillStyle = "#00FF00";
onCtx.textBaseline = "top";
const plaintext = byId("plaintext").value; 
const key = parseInt(byId("key").value); //console.log(key);
const rounds = parseInt(byId("rounds").value); //console.log(rounds);

const visitor = new FeistelVisitor();
const feistel = new FeistelNetwork(key, rounds, visitor);

function encryptDecrypt(msg) {    if ( ! msg ) msg = byId("plaintext").value; 
    // Ensure plaintext is exactly 64 characters
    /*if ( msg.length !== 64 ) {
        alert("Input text must be exactly 64 characters for this Feistel demo. This has "+msg.length);
        return;
    }*/
    const encryptedHex = feistel.encryptString(msg);
    const decrypted = feistel.decryptString(encryptedHex);
    byId("encrypted").innerText = encryptedHex;
    byId("decrypted").innerText = decrypted; 
    //byId("visitor-data").innerHTML = visitor.show();
}

encryptDecrypt(plaintext);

//const message = "THE MOONLIGHT RISES AND THE WHOLE SEA WHISPERS ITS SONG AT NIGHT";
const animator = new Animator(onscreen, onCtx);
const scheduler = new Scheduler(animator, visitor.getData());
//animator.add(new Slider(onscreen, message, -2, onscreen.width, 80));

let startTime = null;
let elapsedSeconds = 0;
let lastTime = 0;
function animate(timestamp) {
    if ( null === startTime ) 
        startTime = timestamp;
    if ( lastTime === 0 ) 
        lastTime = timestamp;
    const dt = timestamp - lastTime; // milliseconds since last frame
    lastTime = timestamp;
    elapsedSeconds = Math.floor((timestamp - startTime) / 1000);
    scheduler.update(elapsedSeconds);
    /*if ( scheduler.triggersAt(elapsedSeconds) ) {
        scheduler.launch(elapsedSeconds);
        animator.add(new Slider(onscreen, plaintext, -4, 80));
    }*/
    //console.log(elapsedSeconds);
    // Clear screen (black CRT background)
    //onCtx.fillStyle = "black";
    //onCtx.fillRect(0, 0, onscreen.width, onscreen.height);
    onCtx.clearRect(0, 0, onscreen.width, onscreen.height);

    // Draw glowing CRT text
    //onCtx.shadowColor = "#00FF00";
    //onCtx.shadowBlur = 8;
    //onCtx.fillStyle = "#00FF00";
    animator.notify(dt);
    requestAnimationFrame(animate);
}

// Start the animation
animate(performance.now());

addEvent("encryptBtn", "click", encryptDecrypt);