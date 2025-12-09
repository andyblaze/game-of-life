import { byId, addEvent } from "./functions.js";
import FeistelVisitor from "./visitor.js";
import FeistelNetwork from "./feistel.js";
import Animator from "./animator.js";
import Scheduler from "./scheduler.js";
import EventContext from "./event-context.js";
import DeltaReport from "./delta-report.js";

function initCanvas(id) {
    const onscreen = byId(id);
    const onCtx = onscreen.getContext("2d");
    onscreen.width = window.innerWidth;
    onscreen.height = window.innerHeight;
    onscreen.style.width = window.innerWidth;
    onscreen.style.height = window.innerHeight;

    onCtx.font = "19px monospace";
    onCtx.fillStyle = "#00FF00";
    onCtx.textBaseline = "top";
    return [onscreen, onCtx];
}
const [onscreen, onCtx] = initCanvas("onscreen");

const plaintext = byId("plaintext").value; 
const key = parseInt(byId("key").value);
const rounds = parseInt(byId("rounds").value); 

const visitor = new FeistelVisitor();
const feistel = new FeistelNetwork(key, rounds, visitor);

function encryptDecrypt(msg) { 
    if ( msg.length !== 64 ) {
        alert("Input text must be exactly 64 characters for this Feistel demo. This has "+msg.length);
        return;
    }
    const encryptedHex = feistel.encryptString(msg);
    const decrypted = feistel.decryptString(encryptedHex);
    byId("encrypted").innerText = encryptedHex;
    byId("decrypted").innerText = decrypted; 
    //byId("visitor-data").innerText = visitor.getDataStr();
}

encryptDecrypt(plaintext);

const animator = new Animator(onscreen);
EventContext.setEvents(visitor.getData());
const scheduler = new Scheduler(animator);
scheduler.start();

let startTime = null;
let elapsedTime = 0;
let lastTime = null;
function animate(timestamp) {
    if ( null === startTime ) 
        startTime = timestamp;
    if ( null === lastTime ) 
        lastTime = timestamp;
    const dt = timestamp - lastTime; // milliseconds since last frame
    elapsedTime = timestamp - startTime;
    lastTime = timestamp;
    scheduler.update();
    onCtx.clearRect(0, 0, onscreen.width, onscreen.height);
    animator.notify(dt, elapsedTime);
    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}

animate(performance.now());

addEvent("encryptBtn", "click", encryptDecrypt);