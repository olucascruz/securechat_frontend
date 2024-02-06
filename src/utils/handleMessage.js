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


export const sendMessageGroupSocket = async (socket, userId, userMessage, userPrivateKey, groupData) =>{
    if(!socket) return false
    if(!groupData) return false
    console.log("message-sendMsgSocket",userMessage)
    console.log("userPrivate-sendMsgSocket",userPrivateKey)
    console.log("groupData-sendMsgSocket",groupData)
    
    for (let memberId in groupData.members) {
        if(memberId == userId) continue  
        let messageEncrypted = null
        try{
            const memberPublicKey = groupData.members[memberId];
            console.log("groupData in handle msg", groupData)
            console.log("memberPublicKey:", memberPublicKey)
            messageEncrypted = await shareKeyAndEncrypt(userPrivateKey, memberPublicKey, userMessage["message"])
            
       
            socket.emit(`message-group`, {
                username: userMessage["username"],
                message: messageEncrypted,
                receiver: memberId,
                sender: userId,
                groupId: groupData.id
            });    
        }catch(error){
            console.log("error encrypt:", error)
        }
        
    }
    

    return true
}

export const receiveMessageGroupSocket = async (socket, userId, userPrivateKey, groupData) =>{
    if(!socket)return
    console.log("userId-receiveMsgSocket",userId)
    console.log("userPrivate-receiveMsgSocket",userPrivateKey)
    console.log("groupData-receiveMsgSocket",groupData)

    const handleMessage = async (data) => {
        try{
            const originPublicKey = groupData["members"][data.sender]
            if(!originPublicKey) return null
            console.log("originPublicKey:", originPublicKey)
            const newMessage = await decryptMessage(userPrivateKey, originPublicKey, data.message)
            
            const newData = {"username":data.username || "error",
                        "message":newMessage || "error"}
            return newData
        }catch(error){
            console.log("handleMessageError:", error)
        }
      };
      
    if(socket){ 
        const newMessage = await new Promise( resolve =>{ 
            
            socket.on(`message-group-${groupData.id}-${userId}`, async (data) => {
                console.log("handle message:",data)
                const newMessage = await handleMessage(data);                
                resolve(newMessage)
              })
        })
        
        return newMessage ? newMessage : null
    }
}


