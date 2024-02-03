import { TextDecoder, TextEncoder } from 'util';
import crypto from "@trust/webcrypto";

if (typeof global !== 'undefined' ) {
    // Código relacionado ao ambiente Node.js
    console.log("entrou aqui")
    // @ts-ignore
    global.crypto.subtle = crypto.subtle;
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;

    // @ts-ignore
    global.setImmediate = global.setTimeout;
  } 