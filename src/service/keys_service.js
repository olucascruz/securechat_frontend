
export async function generateKeyPair() {
  return await crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
}

// Função para derivar a chave compartilhada
export async function deriveSharedKey(privateKey, otherPublicKey) {
  return await crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: otherPublicKey,
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Função para criptografar a mensagem
export async function encryptMessage(sharedKey, message) {
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const encryptedMessage = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    sharedKey,
    new TextEncoder().encode(message)
  );

  return { iv, encryptedMessage };
}

// Função para descriptografar a mensagem
export async function decryptMessage(sharedKey, iv, encryptedMessage) {
  const decryptedMessage = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    sharedKey,
    encryptedMessage
  );

  return new TextDecoder().decode(decryptedMessage);
}
