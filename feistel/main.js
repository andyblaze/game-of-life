import { byId, addEvent } from "./functions.js";
import FeistelVisitor from "./visitor.js";
import FeistelNetwork from "./feistel.js";

// Button function
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