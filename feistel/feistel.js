export default class FeistelNetwork {
    constructor(key, rounds, visitor, blockSize = 64) {
        this.key = key & 0xFF;      // 0–255 key for XOR
        this.rounds = rounds;
        this.visitor = visitor;
        this.blockSize = blockSize; // must be even, fixed at 64

        // Mapping A=0..Z=25, space=26
        this.charToNum = {};
        this.numToChar = {};
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
        [...alphabet].forEach((c, i) => {
            this.charToNum[c] = i;
            this.numToChar[i] = c;
        });
    }
    emit(direction, event, data) {
        this.visitor.collect(direction, event, data);
    }

    // Simple reversible round function
    roundFunction(direction, half, round) {
        return this.and(direction, half, round);
        /*const andValue = 0xFF;
        return half.map((v, i) => {
            (v + this.key + round + i) & andValue;
        });*/
    }
    and(direction, src, round) {
        let emission = [];
        const andValue = 0xFF;
        const result = src.map((v, i) => {
            const r = (v + this.key + round + i) & andValue;
            emission.push({ value: v, "round": round, result: r, and_value: andValue });
            return r;
        });
        this.emit(direction, direction + "_and"+round, emission);
        return result;        
    }
    xor(direction, src, F) {
        let emission = [];
        const result = src.map((v, i) => {
            const r = v ^ F[i];
            emission.push({ value: v, func: F[i], result: r });
            return r;
        });
        this.emit(direction, direction+"_xor", emission);
        return result;        
    }
    // TRUE Feistel: XOR, swap — always reversible
    processBlock(block, decrypt = false) {
        const direction = (decrypt === false ? "encrypt" : "decrypt");
        const mid = this.blockSize / 2;
        let L = block.slice(0, mid);
        let R = block.slice(mid);
        this.emit(direction, "block_split", {"left":L, "right": R});

        const order = decrypt
            ? [...Array(this.rounds).keys()].reverse()
            : [...Array(this.rounds).keys()];
        this.emit(direction, "get_order", order);

        for ( let r of order)  {
            this.emit(direction, "round"+r, r);
            const F = this.roundFunction(direction, decrypt ? L : R, r);
            
            // !!!!!!!!!!!!!!!!!!!!! fix below into 1 liners using a method !!!!!!!!!!!!!!!!!!!!!!!
            if ( decrypt ) {
                // Decrypt
                this.emit(direction, "before_swap"+r, {"left":L, "right": R});
                const newL = this.xor(direction, R, F);//R.map((v, i) => v ^ F[i]);
                R = L;
                L = newL;
                this.emit(direction, "after_swap"+r, {"left":L, "right": R});
            } else {
                // Encrypt
                this.emit(direction, "before_swap"+r, {"left":L, "right": R});
                const newR = this.xor(direction, L, F);//L.map((v, i) => v ^ F[i]); //{
                    //v ^ F[i];
                    //this.emit("xor"+i, {"value":v, "func":F[i]});
                //});
                L = R;
                R = newR;
                this.emit(direction, "after_swap"+r, {"left":L, "right": R});
            }
        }

        return [...L, ...R];
    }

    // A–Z + space → nums 0–26
    stringToNums(str) {
        return [...str].map(c => this.charToNum[c]);
    }

    // nums → A–Z + space
    numsToString(nums) {
        return nums.map(n => this.numToChar[n]).join("");
    }

    // Encrypt 64-char string → hex
    encryptString(str) {
        this.emit("encrypt", "raw_input", str);
        const nums = this.stringToNums(str); // 0–26
        this.emit("encrypt", "transformed_input", nums);
        const out = this.processBlock(nums, false); // 0–255
        this.emit("encrypt", "encrypted_bytes", out);
        return this.bytesToHex(out, "encrypt");
    }

    // Decrypt hex → original 64-char string
    decryptString(hex) {
        this.emit("decrypt", "raw_input", hex);
        const bytes = this.hexToBytes(hex); // raw 0–255
        this.emit("decrypt", "transformed_input", bytes);
        const out = this.processBlock(bytes, true); // 0–255
        this.emit("decrypt", "decrypted_bytes", out);
        const nums = out.map(b => b % 27);          // map back into 0–26
        this.emit("decrypt", "xored_nums", nums);
        const result = this.numsToString(nums);
        this.emit("decrypt", "decrypted_str", result);
        return result;
    }
    bytesToHex(nums, direction) {
        const result = nums.map(n => {
            if ( n === undefined || n < 0 || n > 255 ) {
                throw new Error(`Invalid byte: ${n}`);
            }
            return n.toString(16).padStart(2, '0');
        }).join('');
        this.emit(direction, direction+"ed_bytes_as_hex", result);
        return result;
    }
    hexToBytes(hexStr) {
        const out = [];
        for ( let i = 0; i < hexStr.length; i += 2 ) {
            const n = parseInt(hexStr.slice(i, i + 2), 16);
            out.push(n); // allow full 0–255
        }
        return out;
    }
}
