
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

