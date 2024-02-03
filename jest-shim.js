import { ArrayBuffer, TextDecoder, TextEncoder} from 'util';
import crypto from "@trust/webcrypto";
// @ts-ignore
global.crypto.subtle = crypto.subtle;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// global.ArrayBuffer = ArrayBuffer;
