// Imports
import crypto from 'crypto';
import EC from 'elliptic';

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
  
  console.log("iv", iv)
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
export const decryptMessage = async (privateKey, originPublicKey, encryptedMessage) => {
  const ec = new EC.ec('secp256k1');
  console.log(privateKey)
  console.log(originPublicKey)
  console.log(encryptedMessage)

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
  let ciphertext = null
  
  try{
    iv = encryptedMessage.slice(0, 16);
    ciphertext = encryptedMessage.slice(16);
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
    ciphertext
    );  
  } catch (error) {
    console.log("decifer:",error)
  }

  console.log("text decifer:", decipher)
  
  let decryptedMessage = ""
  try{
    decryptedMessage = new TextDecoder().decode(decipher);
  }catch(error){
    console.log("decifer error:",error)
  }

  console.log(decryptedMessage)
  return decryptedMessage;
};

// // Person A
// const personA = generateKeyAndExtractPublic();

// // Person B
// const personB = generateKeyAndExtractPublic();

// // Person A shares key and encrypts message for Person B
// const encryptedMessageAtoB = shareKeyAndEncrypt(personA.privateKey, personB.publicKey, 'Hi Person B, I am Person A! MOTO MOTO OIEEEEE');
// console.log('Person A encrypted message for Person B:', encryptedMessageAtoB);

// // Person B decrypts message from Person A
// const decryptedMessageB = decryptMessage(personB.privateKey, personA.publicKey, Buffer.from(encryptedMessageAtoB, 'hex'));
// console.log('Person B decrypted message from Person A:', decryptedMessageB);

// // Additional simulation: Person C
// const personC = generateKeyAndExtractPublic();
// const encryptedMessageAtoC = shareKeyAndEncrypt(personA.privateKey, personC.publicKey, 'Hi Person C, message from Person A for you!');
// console.log('Person A encrypted message for Person C:', encryptedMessageAtoC);

// const decryptedMessageC = decryptMessage(personC.privateKey, personA.publicKey, Buffer.from(encryptedMessageAtoC, 'hex'));
// console.log('Person C decrypted message from Person A:', decryptedMessageC);
