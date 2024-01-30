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
