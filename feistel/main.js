import { byId, addEvent } from "./functions.js";
import FeistelVisitor from "./visitor.js";
import FeistelNetwork from "./feistel.js";
import Animator from "./animator.js";

const onscreen = byId("onscreen");
const onCtx = onscreen.getContext("2d");
onscreen.width = window.innerWidth;
onscreen.height = window.innerHeight;
onscreen.style.width = window.innerWidth;
onscreen.style.height = window.innerHeight;

onCtx.font = "19px monospace";
onCtx.fillStyle = "#00FF00";
onCtx.textBaseline = "top";

const message = "THE MOONLIGHT RISES AND THE WHOLE SEA WHISPERS ITS SONG AT NIGHT";
const animator = new Animator(onscreen, onCtx);

let x = onscreen.width;  // start completely off-screen right
const y = 80;          // vertical position
const speed = 2;       // pixels per frame

function animate(timestamp) {
    // Clear screen (black CRT background)
    //onCtx.fillStyle = "black";
    //onCtx.fillRect(0, 0, onscreen.width, onscreen.height);
    onCtx.clearRect(0, 0, onscreen.width, onscreen.height);

    // Draw glowing CRT text
    //onCtx.shadowColor = "#00FF00";
    //onCtx.shadowBlur = 8;
    onCtx.fillStyle = "#00FF00";
    animator.slideIn(message, 2, onscreen.width, 80);
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

function encryptDecrypt() {
    const plaintext = byId("plaintext").value; 
    const key = parseInt(byId("key").value);
    const rounds = parseInt(byId("rounds").value);

    // Ensure plaintext is exactly 64 characters
    if ( plaintext.length !== 64 ) {
        alert("Input text must be exactly 64 characters for this Feistel demo.");
        return;
    }
    const visitor = new FeistelVisitor();
    const feistel = new FeistelNetwork(key, rounds, visitor);

    const encryptedHex = feistel.encryptString(plaintext);
    const decrypted = feistel.decryptString(encryptedHex);

    byId("encrypted").innerText = encryptedHex;
    byId("decrypted").innerText = decrypted; 
    byId("visitor-data").innerHTML = visitor.show();
}

addEvent("encryptBtn", "click", encryptDecrypt);