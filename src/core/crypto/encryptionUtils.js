// Imports
import crypto from 'crypto';
import EC from 'elliptic';
// import { TextEncoder, TextDecoder } from 'util';

function generateRandomHexBytes(length) {
  const randomBytes = [];
  for (let i = 0; i < length; i++) {
    // Generate a random number between 0 and 255 (8 bits)
    const randomByte = Math.floor(Math.random() * 256);
    // Convert the number to a hexadecimal string
    const hexByte = randomByte.toString(16).padStart(2, '0');
    // Add to the array of random bytes
    randomBytes.push(hexByte);
  }
  // Join the bytes into a single string
  const hexString = randomBytes.join('');
  return hexString;
}

// Function to generate key and extract public key
export const generateKeyAndExtractPublic = () => {
  const ec = new EC.ec('secp256k1');
  
  const key = ec.genKeyPair();
  return {
    privateKey: key.getPrivate('hex'),
    publicKey: key.getPublic('hex'),
  };
};

// Function to share key and encrypt message
export const shareKeyAndEncrypt = async (privateKey, destinationPublicKey, message) => {
  const ec = new EC.ec('secp256k1');

  const privateKeyObj = ec.keyFromPrivate(privateKey, 'hex');
  const sharedKeyArray = privateKeyObj.derive(ec.keyFromPublic(destinationPublicKey, 'hex').getPublic()).toArray();

  console.log("shared key array - fun -> shareKeyAndEncrypt", sharedKeyArray)
  const sharedKeyBuffer = new Uint8Array(sharedKeyArray).buffer;

  const importedKey = await window.crypto.subtle.importKey(
    'raw', // formato da chave (raw para bytes brutos)
    sharedKeyBuffer,
    { name: 'AES-CTR' },
    false, // não extrai para criptografia
    ['encrypt', 'decrypt'] // operações permitidas
  );
  // const sharedKeyBuffer=new Uint8Array(sharedKey)
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  
  console.log("iv - fun -> shareKeyAndEncrypt", iv)
  let cipher = null;
  try {
      cipher = await window.crypto.subtle.encrypt({
      name: 'AES-CTR',
      counter: iv.buffer,
      length: 128 }, importedKey, new TextEncoder().encode(message));  
  } catch (error) {
    console.log(error)
  }
  
  /// Converte o resultado da cifragem (cipher) para Uint8Array
  const cipherArrayBuffer = new Uint8Array(cipher);

  // Concatena iv e cipherArrayBuffer usando Uint8Array
  const encryptedMessage = new Uint8Array(iv.length + cipherArrayBuffer.length);
  encryptedMessage.set(iv);
  encryptedMessage.set(cipherArrayBuffer, iv.length);

  return arrayBufferToHex(encryptedMessage);
};

function arrayBufferToHex(buffer) {
  const byteArray = new Uint8Array(buffer);
  const hexArray = Array.from(byteArray, byte => byte.toString(16).padStart(2, '0'));
  return hexArray.join('');
}

function hexToArrayBuffer(hexString) {
  // Remova os espaços e converta para caixa baixa
  const hexWithoutSpaces = hexString.replace(/\s/g, '').toLowerCase();

  // Divida a string em pares de caracteres
  const pairs = hexWithoutSpaces.match(/.{1,2}/g);

  // Converta os pares de caracteres para números inteiros
  const byteArray = pairs.map(pair => parseInt(pair, 16));

  // Crie um Uint8Array a partir da matriz de números inteiros
  return new Uint8Array(byteArray).buffer;
}

// Function to decrypt message
export const decryptMessage = async (privateKey, 
                                    originPublicKey, 
                                    encryptedMessage) => {
  
  const ec = new EC.ec('secp256k1');
  
  if(!privateKey  || !originPublicKey || !encryptedMessage) {
    console.error("Params not expected")
    if(!privateKey)console.error("not found privateKey: ", privateKey)
    if(!originPublicKey)console.error("not found publicKey: ", originPublicKey)
    if(!encryptedMessage)console.error("not found: encryptedMessage:", encryptedMessage)

    return
  }


  encryptedMessage = hexToArrayBuffer(encryptedMessage)

  const privateKeyObj = ec.keyFromPrivate(privateKey, 'hex');
  const sharedKeyArray = privateKeyObj.derive(ec.keyFromPublic(originPublicKey, 'hex').getPublic()).toArray();
  const sharedKeyBuffer = new Uint8Array(sharedKeyArray).buffer;

  const importedKey = await window.crypto.subtle.importKey(
    'raw', // formato da chave (raw para bytes brutos)
    sharedKeyBuffer,
    { name: 'AES-CTR' },
    false, // não extrai para criptografia
    ['encrypt', 'decrypt'] // operações permitidas
  );
  
  let iv = null
  let cipherText = null
  
  try{
    iv = encryptedMessage.slice(0, 16);
    cipherText = encryptedMessage.slice(16);
  }catch(error){
    console.log("slice error:", error);
  }

  console.log(iv)
  let decipher = "ola mundo";
  
  try {
    decipher = await window.crypto.subtle.decrypt({
    name: 'AES-CTR',
    counter: iv,
    length: 128 }, 
    importedKey, 
    cipherText
    );  
  } catch (error) {
    console.log("decipher:",error)
  }

  console.log("text decipher:", decipher)
  
  let decryptedMessage = ""
  try{
    decryptedMessage = new TextDecoder().decode(decipher);
  }catch(error){
    console.log("decipher error:",error)
  }

  console.log(decryptedMessage)
  return decryptedMessage;
};