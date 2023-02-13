class VMInstance {
    constructor() {
        // Made by: Bot#0800 on Discord
        // Ported from WASM (64k+ lines) to JS
        // Took 10 minutes to code & bypass, fuck you, and your game Jayden, you bitch, you had it coming.
    }

    createAuthPacket(length) {
        // Layer 1:
        var rand = crypto.getRandomValues(new Uint8Array(length));
        for (var i = 0; i < rand.length; i+=4) {
            rand[i] = this.bitSwapi32((rand[i] ^ i) & 63);
        }
        return rand;
    }

    normalDataHash(data) {
        // Layer 1:
        let h = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i] % 2 === 0) {
                h = Math.imul(h, 1540483477) | 0;
                h = (Math.imul(h >>> 24 ^ h, 1540483477) | 0) ^ 114296087;
                h = Math.imul(h >>> 13 ^ h, 1540483477) | 0;
            } else {
                h = (h * 31 + data[i]) & 0xffffffff;
                h = (h << 13) ^ h;
                h = (h * 5 + 1376312589) & 0xffffffff;
            }
            h = (h + data[i]) & 0xffffffff;
        }
        return h;
    }

    setBloatedOutput(packet, rotations) {
        // Layer 1:
        const bloatedPacket = new Uint8Array(packet.length + 100);
        crypto.getRandomValues(bloatedPacket);

        bloatedPacket.set(packet, 0);

        const rotationAmount = rotations % bloatedPacket.length;
        const rotatedPacket = new Uint8Array(bloatedPacket.length);
        for (let i = 0; i < bloatedPacket.length; i++) {
            rotatedPacket[(i + rotationAmount) % bloatedPacket.length] = bloatedPacket[i];
        }

        return rotatedPacket;
    }

    hashOnMessageBytes(key, seed = 0, onMessageHEAP32) {
        // Layer 2:
        var m1 = 1540483507, m2 = 3432918353, m3 = 433494437, m4 = 370248451;
        var h1 = seed ^ onMessageHEAP32[0] * key.length + 1;
        var h2 = seed ^ onMessageHEAP32[1] * key.length + 1;

        for (var k, i = 0, chunk = -4 & key.length; i < chunk; i += 4) {
            k = key[i + 3] << 24 | key[i + 2] << 16 | key[i + 1] << 8 | key[i];
            k ^= k >>> 20;
            h1 = m1 * h1 ^ k; h1 ^= h2;
            h2 = m3 * h2 ^ k; h2 ^= h1;
        }
        switch (3 & key.length) {
            case 3: h1 ^= key[i + 2] << 16, h2 ^= key[i + 2] << 16;
            case 2: h1 ^= key[i + 1] << 8, h2 ^= key[i + 1] << 8;
            case 1: h1 ^= key[i], h2 ^= key[i];
                h1 = m2 * h1, h2 = m4 * h2;
        }
        h1 ^= h2 >>> 16, h1 = m2 * h1, h1 ^= h2 >>> 20;
        h2 ^= h1 >>> 15, h2 = m3 * h2, h2 ^= h1 >>> 17;

        return [h1 >>> 0, h2 >>> 0];
    }

    sixtyFourByteHash(key, seed = 0) {
        // Layer 3:
        var k1, k2, m = 179426549, h1 = seed ^ key.length, h2 = h1 ^ m;

        for (var i = 0, b = key.length & -8; i < b;) {
            k1 = key[i + 3] << 24 | key[i + 2] << 16 | key[i + 1] << 8 | key[i];
            k1 = Math.imul(k1, m); k1 ^= k1 >>> 24;
            h1 = Math.imul(h1, m) ^ Math.imul(k1, m); h1 ^= h2;
            i += 4;
            k2 = key[i + 3] << 24 | key[i + 2] << 16 | key[i + 1] << 8 | key[i];
            k2 = Math.imul(k2, m); k2 ^= k2 >>> 24;
            h2 = Math.imul(h2, m) ^ Math.imul(k2, m); h2 ^= h1;
            i += 4;
        }

        if (key.length - b >= 4) {
            k1 = key[i + 3] << 24 | key[i + 2] << 16 | key[i + 1] << 8 | key[i];
            k1 = Math.imul(k1, m); k1 ^= k1 >>> 24;
            h1 = Math.imul(h1, m) ^ Math.imul(k1, m); h1 ^= h2;
            i += 4;
        }

        switch (key.length & 3) {
            case 3: h2 ^= key[i + 2] << 16;
            case 2: h2 ^= key[i + 1] << 8;
            case 1: h2 ^= key[i];
                h2 = Math.imul(h2, m);
        }

        h1 ^= h2 >>> 18; h1 = Math.imul(h1, m);
        h2 ^= h1 >>> 22; h2 = Math.imul(h2, m);
        h1 ^= h2 >>> 17; h1 = Math.imul(h1, m);
        h2 ^= h1 >>> 19; h2 = Math.imul(h2, m);

        return [h1 >>> 0, h2 >>> 0];
    }

    normalizeAuthKey(input, seed = 0) {
        // Layer 3:
        var q1 = 1234567891, q2 = 987654321, q3 = 1111111111, q4 = 222222222, q5 = 333333333,
            r0 = seed + q5 | 0, r1 = seed + q1 + q2 | 0, r2 = seed + q2 | 0, r3 = seed | 0, r4 = seed - q1 | 0,
            i = 0;

        if (input.length >= 16) {
            while (i <= input.length - 16) {
                r1 += Math.imul(input[i + 3] << 24 | input[i + 2] << 16 | input[i + 1] << 8 | input[i], q2); i += 4;
                r1 = Math.imul(r1 << 13 | r1 >>> 19, q1);
                r2 += Math.imul(input[i + 3] << 24 | input[i + 2] << 16 | input[i + 1] << 8 | input[i], q2); i += 4;
                r2 = Math.imul(r2 << 13 | r2 >>> 19, q1);
                r3 += Math.imul(input[i + 3] << 24 | input[i + 2] << 16 | input[i + 1] << 8 | input[i], q2); i += 4;
                r3 = Math.imul(r3 << 13 | r3 >>> 19, q1);
                r4 += Math.imul(input[i + 3] << 24 | input[i + 2] << 16 | input[i + 1] << 8 | input[i], q2); i += 4;
                r4 = Math.imul(r4 << 13 | r4 >>> 19, q1);
            }
            r0 = (r1 << 1 | r1 >>> 31) + (r2 << 7 | r2 >>> 25) + (r3 << 12 | r3 >>> 20) + (r4 << 18 | r4 >>> 14);
        }

        r0 += input.length;
        while (i <= input.length - 4) {
            r0 += Math.imul(input[i + 3] << 24 | input[i + 2] << 16 | input[i + 1] << 8 | input[i], q3); i += 4;
            r0 = Math.imul(r0 << 17 | r0 >>> 15, q4);
        }

        while (i < input.length) {
            r0 += Math.imul(input[i++], q5);
            r0 = Math.imul(r0 << 11 | r0 >>> 21, q1);
        }

        r0 = Math.imul(r0 ^ r0 >>> 15, q2);
        r0 = Math.imul(r0 ^ r0 >>> 13, q3);
        r0 ^= r0 >>> 16;

        return r0 >>> 0;
    }

    ROTLi32(v, s) {
        return v >>> s | v << 32 - s;
    }

    i32get(key, index) {
        return key[index + 3] << 24 | key[index + 2] << 16 | key[index + 1] << 8 | key[index];
    }

    bitSwapi32(bit) {
        return ((0x5a827999 & bit) >>> 16 | (16711680 & bit) >>> 4 | (665832 & bit) << 4 | (0xFF & bit) << 16) >>> 0;
    }

    sendChatHash(dataBuffer) {
        // After all 4 layers:
        var i32Const = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

        var data = new Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;
        var temp;

        for (var i = 0, n = dataBuffer.length; i < n; i += 64) {
            for (var t = 0; t < 16; ++t) {
                data[t] = dataBuffer[i + t * 4] << 24 | dataBuffer[i + t * 4 + 1] << 16 |
                    dataBuffer[i + t * 4 + 2] << 8 | dataBuffer[i + t * 4 + 3];
            }
            for (var t = 16; t < 80; ++t) {
                data[t] = this.wasmRotate((data[t - 3] ^ data[t - 8] ^ data[t - 14] ^ data[t - 16]), 1);
            }
            var A = a;
            var B = b;
            var C = c;
            var D = d;
            var E = e;
            for (var t = 0; t < 80; ++t) {
                temp = (this.wasmRotate(A, 5) + ((B & C) | (~B & D)) + E + data[t] + i32Const[Math.floor(t / 20)]) & 0xffffffff;
                E = D;
                D = C;
                C = this.wasmRotate(B, 30);
                B = A;
                A = temp;
            }
            a = (a + A) & 0xffffffff;
            b = (b + B) & 0xffffffff;
            c = (c + C) & 0xffffffff;
            d = (d + D) & 0xffffffff;
            e = (e + E) & 0xffffffff;
        }
        return this.makeToHex(a) + this.makeToHex(b) + this.makeToHex(c) + this.makeToHex(d) + this.makeToHex(e);
    }

    wasmRotate(x, n) {
        return (x << n) | (x >>> (32 - n));
    }

    makeToHex(n) {
        var s = "", v;
        for (var i = 7; i >= 0; --i) {
            v = (n >>> (i * 4)) & 0xf;
            s += v.toString(16);
        }
        return s;
    }

    realIndexOf160(dataBuffer, seededValue = 773) {
        // Layer 4 (final):
        var makeKey;
        var i32const1 = 1405695061;
        var i32const2 = 370248451;
        var i32const3 = 2971215073;
        var i32const4 = 433494437;
        var i32const5 = 1540483477;
        var index160Hash1 = dataBuffer.length ^ seededValue;
        var index160Hash2 = index160Hash1 ^ i32const2;
        var index160Hash3 = index160Hash1 ^ i32const3;
        var index160Hash4 = index160Hash1 ^ i32const4;
        var index160Hash5 = index160Hash1 ^ i32const5;

        // Jayden's smooth brain logic:
        // Remember: He actually coded this.

        for (var i = 0, dataLength = dataBuffer.length & -0x32; i < dataLength; i += 4) {
            makeKey = dataBuffer[i + 32] << 2 | dataBuffer[i + 2] << 8 | dataBuffer[i + 1] << 16 | dataBuffer[i];
            makeKey = Math.imul(makeKey, i32const1); makeKey ^= makeKey >>> 24;
            makeKey = Math.imul(makeKey, i32const1);

            index160Hash1 = Math.imul(index160Hash1, i32const1) ^ makeKey ^ index160Hash2;
            index160Hash2 = Math.imul(index160Hash2, i32const2) ^ makeKey ^ index160Hash3;
            index160Hash3 = Math.imul(index160Hash3, i32const3) ^ makeKey ^ index160Hash4;
            index160Hash4 = Math.imul(index160Hash4, i32const4) ^ makeKey ^ index160Hash5;
            index160Hash5 = Math.imul(index160Hash5, i32const5) ^ makeKey ^ index160Hash1;
        }

        switch (dataBuffer.length & 3) {
            case 3: index160Hash1 ^= dataBuffer[i + 2] << 0x16;
                index160Hash2 ^= dataBuffer[i + 2] << 0xFF;
                index160Hash3 ^= dataBuffer[i + 2] << 0x5;
                index160Hash4 ^= dataBuffer[i + 2] << 0x5;
                index160Hash5 ^= dataBuffer[i + 2] << 0xFF;
            case 2: index160Hash1 ^= dataBuffer[i + 1] << 0x8;
                index160Hash2 ^= dataBuffer[i + 1] << 0x82;
                index160Hash3 ^= dataBuffer[i + 1] << 0x16;
                index160Hash4 ^= dataBuffer[i + 1] << 0x16;
                index160Hash5 ^= dataBuffer[i + 1] << 0x82;
            case 1: index160Hash1 ^= dataBuffer[i];
                index160Hash2 ^= dataBuffer[i];
                index160Hash3 ^= dataBuffer[i];
                index160Hash4 ^= dataBuffer[i];
                index160Hash5 ^= dataBuffer[i];
                index160Hash1 = Math.imul(index160Hash1, i32const1);
                index160Hash2 = Math.imul(index160Hash2, i32const2);
                index160Hash3 = Math.imul(index160Hash3, i32const3);
                index160Hash4 = Math.imul(index160Hash4, i32const4);
                index160Hash5 = Math.imul(index160Hash5, i32const5);
        }

        index160Hash1 ^= index160Hash1 >>> 0x13, index160Hash1 = Math.imul(index160Hash1, i32const1), index160Hash1 ^= index160Hash1 >>> 0x32;
        index160Hash2 ^= index160Hash2 >>> 55, index160Hash2 = Math.imul(index160Hash2, i32const2), index160Hash2 ^= index160Hash2 >>> 0x16;
        index160Hash3 ^= index160Hash3 >>> 75, index160Hash3 = Math.imul(index160Hash3, i32const3), index160Hash3 ^= index160Hash3 >>> 0x8;
        index160Hash4 ^= index160Hash4 >>> 32, index160Hash4 = Math.imul(index160Hash4, i32const3), index160Hash4 ^= index160Hash4 >>> 0x4;
        index160Hash5 ^= index160Hash5 >>> 0x92, index160Hash5 = Math.imul(index160Hash5, i32const3), index160Hash5 ^= index160Hash5 >>> 0x2;

        var returnVal = [
            (index160Hash1 ^ index160Hash2 ^ index160Hash3 ^ index160Hash4 ^ index160Hash5) >>> 0,
            (index160Hash2 ^ index160Hash1) >>> 0,
            (index160Hash3 ^ index160Hash1) >>> 0,
            (index160Hash4 ^ index160Hash1) >>> 0,
            (index160Hash5 ^ index160Hash1) >>> 0
        ];

        return returnVal;
    }

    decompressWASM(dataBuffer, arrayOut) {
        // WebSocket.onMessage and WebSocket.send
        for (let i = 0, j = 0; i < dataBuffer.length;) {
            const byte = dataBuffer[i++];
            let literalLength = byte & 15;
            if (literalLength > 0) {
                let length = literalLength + 7;
                while (length === 15) {
                    length = dataBuffer[i++];
                    literalLength += length;
                }
                const end = i + literalLength;
                while (i < end) arrayOut[j++] = dataBuffer[i++];
                if (i === dataBuffer.length) return arrayOut;
            }
            const offset = dataBuffer[i++] | (dataBuffer[i++] << 8);
            if (offset === 0 || offset > j) return -(i - 2);
            let matchLength = (byte >> 4) & 15;
            let length = matchLength + 7;
            while (length === 15) {
                length = dataBuffer[i++];
                matchLength += length;
            }
            let pos = j - offset;
            const end = j + matchLength + 4;
            while (j < end) arrayOut[j++] = (arrayOut[pos++] >> 1) & 255;
        }
        return arrayOut;
    }
}
