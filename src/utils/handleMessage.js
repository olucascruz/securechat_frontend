import {shareKeyAndEncrypt, decryptMessage} from "../service/cryptography_service" 

export const sendMessageSocket = async (socket, userMessage, userPrivateKey, receiverData) =>{
    if(!socket) return false
    const messageEncrypted = await shareKeyAndEncrypt(userPrivateKey, receiverData.publicKey, userMessage["message"])
    
    socket.emit('message', {
        username: userMessage["username"],
        message: messageEncrypted,
        receiver: receiverData["id"] 
    });

    return true
}

export const receiveMessageSocket = async (socket, userId, userPrivateKey, receiverPublicKey) =>{
    const handleMessage = async (data) => {
        const newMessage = await decryptMessage(userPrivateKey,receiverPublicKey, data.message)
        const newData = {"username":data.username || "error",
                    "message":newMessage || "error"}
        return newData
      };
      
    if(socket){ 
        const newMessage = await new Promise( resolve =>{ 
        
            socket.on(`message-${userId}`, async (data) => {
                const newMessage = await handleMessage(data);                
                resolve(newMessage)
              });
        })
        
        return newMessage ? newMessage : null
    }
}