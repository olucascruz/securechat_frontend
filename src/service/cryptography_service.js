export async function encryptData(publicKey, data) {
    try {
      // Converte a chave pública do formato base64 para Uint8Array
      const publicKeyBuffer = new Uint8Array(atob(publicKey).split('').map(char => char.charCodeAt(0)));
      
      // Importa a chave pública
      const importedKey = await crypto.subtle.importKey(
        'spki',
        publicKeyBuffer.buffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
      );
  
      // Converte os dados para Uint8Array
      const dataBuffer = new TextEncoder().encode(data);
  
      // Criptografa os dados
      const encryptedDataBuffer = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, importedKey, dataBuffer);
  
      // Converte os dados criptografados para base64
      const encryptedDataBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedDataBuffer)));
  
      return encryptedDataBase64;
    } catch (error) {
      console.error('Erro ao criptografar dados:', error);
    }
  }
  
  // Função para descriptografar dados usando a chave privada
export async function decryptData(privateKey, encryptedData) {
    try {
      // Converte a chave privada do formato base64 para Uint8Array
      const privateKeyBuffer = new Uint8Array(atob(privateKey).split('').map(char => char.charCodeAt(0)));
      
      // Importa a chave privada
      const importedKey = await crypto.subtle.importKey(
        'pkcs8',
        privateKeyBuffer.buffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['decrypt']
      );
  
      // Converte os dados criptografados de base64 para Uint8Array
      const encryptedDataBuffer = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
  
      // Descriptografa os dados
      const decryptedDataBuffer = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, importedKey, encryptedDataBuffer);
  
      // Converte os dados descriptografados para uma string
      const decryptedData = new TextDecoder().decode(decryptedDataBuffer);
  
      return decryptedData;
    } catch (error) {
      console.error('Erro ao descriptografar dados:', error);
    }
  }

