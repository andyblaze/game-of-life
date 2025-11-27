import { byId, addEvent } from "./functions.js";
import FeistelVisitor from "./visitor.js";
import FeistelNetwork from "./feistel.js";
import { Animator, Slider} from "./animator.js";
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
const visitor = new FeistelVisitor();
const feistel = new FeistelNetwork(key, rounds, visitor);

function encryptDecrypt(msg) {    
    const key = parseInt(byId("key").value);
    const rounds = parseInt(byId("rounds").value);
    // Ensure plaintext is exactly 64 characters
    if ( msg.length !== 64 ) {
        alert("Input text must be exactly 64 characters for this Feistel demo.");
        return;
    }
    const encryptedHex = feistel.encryptString(msg);
    const decrypted = feistel.decryptString(encryptedHex);
    //byId("encrypted").innerText = encryptedHex;
    //byId("decrypted").innerText = decrypted; 
    //byId("visitor-data").innerHTML = visitor.show();
}

encryptDecrypt(plaintext);

//const message = "THE MOONLIGHT RISES AND THE WHOLE SEA WHISPERS ITS SONG AT NIGHT";
const scheduler = new Scheduler(visitor.getData());
const animator = new Animator(onscreen, onCtx);
//animator.add(new Slider(onscreen, message, -2, onscreen.width, 80));

let startTime = null;
let elapsedSeconds = 0;
function animate(timestamp) {
    if ( null === startTime ) 
        startTime = timestamp;
    elapsedSeconds = Math.floor((timestamp - startTime) / 1000);
    if ( scheduler.triggersAt(elapsedSeconds) ) {
        scheduler.launch(elapsedSeconds);
        animator.add(new Slider(onscreen, plaintext, -4, onscreen.width, 80));
    }
    //console.log(elapsedSeconds);
    // Clear screen (black CRT background)
    //onCtx.fillStyle = "black";
    //onCtx.fillRect(0, 0, onscreen.width, onscreen.height);
    onCtx.clearRect(0, 0, onscreen.width, onscreen.height);

    // Draw glowing CRT text
    //onCtx.shadowColor = "#00FF00";
    //onCtx.shadowBlur = 8;
    //onCtx.fillStyle = "#00FF00";
    animator.notify();
    //onCtx.fillText(message, x, y);

    // Move text left each frame
    //x -= speed;

    // Loop it when it runs off the left side
    //const textWidth = onCtx.measureText(message).width;
    //if (x < -textWidth) x = onscreen.width;

    requestAnimationFrame(animate);
}

// Start the animation
animate(performance.now());

addEvent("encryptBtn", "click", encryptDecrypt);