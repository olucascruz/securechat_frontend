import EC from 'elliptic';

export const recoverReceiverData = () =>{
    const receiverId = sessionStorage.getItem("receiverId");
    const receiverUsername = sessionStorage.getItem("receiverUsername");
    const receiverPublicKey = sessionStorage.getItem("receiverPublicKey");
    const receiverIsOnline = sessionStorage.getItem("receiverIsOnline");

    const receiverData = {
    id: receiverId || '', // Definir um valor padrão vazio se o item não estiver presente
    username: receiverUsername || '',
    publicKey: receiverPublicKey || '',
    is_online: receiverIsOnline === "true", // Converter para booleano se necessário
    };

    return receiverData    
}


export const recoverKeys = () =>{
    
    const userPrivateKeyString = sessionStorage.getItem("userPrivateKey")
    const ec_1 = new EC.ec('secp256k1');
    const userKeyPairObject = ec_1.keyFromPrivate(userPrivateKeyString, 'hex')

    const userKeyPair ={
        "publicKey":userKeyPairObject.getPublic('hex'),
        "privateKey":userKeyPairObject.getPrivate('hex')
    }
    return userKeyPairObject
}

export const recoverUserData = () =>{

    const dataName = sessionStorage.getItem("username")
    const dataId = sessionStorage.getItem("userId")


    const recoverData = {"username":dataName || '',
                         "id":dataId || ''}
    return recoverData
}

export const defineUserKeyPair = (privateKey, publicKey) =>{
    sessionStorage.setItem("userPrivateKey", privateKey);
    sessionStorage.setItem("userPublicKey", publicKey);
}

export const defineUserData = (username, userId) =>{
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("userId", userId);
}


export const defineReceiver = () =>{

}

export const defineGroupUsers = () =>{


}