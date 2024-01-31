// Imports
import crypto from 'crypto';
import EC from 'elliptic';


// Function to generate key and extract public key
const generateKeyAndExtractPublic = () => {
  const ec = new EC.ec('secp256k1');
  
  const key = ec.genKeyPair();
  return {
    privateKey: key.getPrivate('hex'),
    publicKey: key.getPublic('hex'),
  };
};

// Function to share key and encrypt message
const shareKeyAndEncrypt = (privateKey, destinationPublicKey, message) => {
  const ec = new EC.ec('secp256k1');

  const privateKeyObj = ec.keyFromPrivate(privateKey, 'hex');
  const sharedKey = privateKeyObj.derive(ec.keyFromPublic(destinationPublicKey, 'hex').getPublic()).toArray();

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(sharedKey), iv);
  const encryptedMessage = Buffer.concat([iv, cipher.update(message, 'utf-8'), cipher.final()]);

  return encryptedMessage.toString('hex');
};

// Function to decrypt message
const decryptMessage = (privateKey, originPublicKey, encryptedMessage) => {
  const ec = new EC.ec('secp256k1');

  const privateKeyObj = ec.keyFromPrivate(privateKey, 'hex');
  const sharedKey = privateKeyObj.derive(ec.keyFromPublic(originPublicKey, 'hex').getPublic()).toArray();

  const iv = encryptedMessage.slice(0, 16);
  const ciphertext = encryptedMessage.slice(16);
  const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(sharedKey), iv);
  const decryptedMessage = decipher.update(ciphertext, 'hex', 'utf-8') + decipher.final('utf-8');

  return decryptedMessage;
};

// Person A
const personA = generateKeyAndExtractPublic();

// Person B
const personB = generateKeyAndExtractPublic();

// Person A shares key and encrypts message for Person B
const encryptedMessageAtoB = shareKeyAndEncrypt(personA.privateKey, personB.publicKey, 'Hi Person B, I am Person A! MOTO MOTO OIEEEEE');
console.log('Person A encrypted message for Person B:', encryptedMessageAtoB);

// Person B decrypts message from Person A
const decryptedMessageB = decryptMessage(personB.privateKey, personA.publicKey, Buffer.from(encryptedMessageAtoB, 'hex'));
console.log('Person B decrypted message from Person A:', decryptedMessageB);

// Additional simulation: Person C
const personC = generateKeyAndExtractPublic();
const encryptedMessageAtoC = shareKeyAndEncrypt(personA.privateKey, personC.publicKey, 'Hi Person C, message from Person A for you!');
console.log('Person A encrypted message for Person C:', encryptedMessageAtoC);

const decryptedMessageC = decryptMessage(personC.privateKey, personA.publicKey, Buffer.from(encryptedMessageAtoC, 'hex'));
console.log('Person C decrypted message from Person A:', decryptedMessageC);
