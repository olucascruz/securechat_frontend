import {shareKeyAndEncrypt, decryptMessage} from "../service/cryptography_service" 

export const sendMessageSocket = async (socket, userMessage, userPrivateKey, receiverData) =>{
    if(!socket) return false
    if(!receiverData) return false
    console.log("message-sendMsgSocket",userMessage)
    console.log("userPrivate-sendMsgSocket",userPrivateKey)
    console.log("receiverData-sendMsgSocket",receiverData)
    

    let messageEncrypted = null
    try{
        messageEncrypted = await shareKeyAndEncrypt(userPrivateKey, receiverData["publicKey"], userMessage["message"])
    }catch(error){
    console.log("error encrypt:", error)
    }
    socket.timeout(5000).emit('message', {
        username: userMessage["username"],
        message: messageEncrypted,
        receiver: receiverData["id"] 
    });

    return true
}

export const receiveMessageSocket = async (socket, userId, userPrivateKey, 
otherPublicKey) =>{
    if(!socket)return
    console.log("userId-receiveMsgSocket",userId)
    console.log("userPrivate-receiveMsgSocket",userPrivateKey)
    console.log("receiverPubblic-receiveMsgSocket",otherPublicKey)

    const handleMessage = async (data) => {
        try{
            const newMessage = await decryptMessage(userPrivateKey,otherPublicKey, data.message)
            const newData = {"username":data.username || "error",
                        "message":newMessage || "error"}
            return newData
        }catch(error){
            console.log("handleMessageError:", error)
        }
      };
      
    if(socket){ 
        const newMessage = await new Promise( resolve =>{ 
            
            socket.on(`message-${userId}`, async (data) => {
                console.log("handle message:",data)
                const newMessage = await handleMessage(data);                
                resolve(newMessage)
              })
        })
        
        return newMessage ? newMessage : null
    }
}