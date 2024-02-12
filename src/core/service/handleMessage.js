    import {shareKeyAndEncrypt, decryptMessage} from "../crypto/encryptionUtils" 

    export const sendMessageSocket = async (socket, userMessage, userPrivateKey, receiverData) =>{
        if(!socket) return false
        if(!receiverData) return false
        console.log("message-sendMsgSocket",userMessage)
        console.log("userPrivate-sendMsgSocket",userPrivateKey)
        console.log("receiverData-sendMsgSocket",receiverData)
        

        let messageEncrypted = null
        try{
            messageEncrypted = await shareKeyAndEncrypt(userPrivateKey, receiverData["publicKey"], userMessage["message"])
            console.log("encrypt message - fun -> send message group:",messageEncrypted)
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
        console.log("user id - fun ->receiveMsgSocket",userId)
        console.log("user private key - fun -> receiveMsgSocket",userPrivateKey)
        console.log("receiver public key - fun ->receiveMsgSocket",otherPublicKey)

        const handleMessage = async (data) => {
            try{
                console.log("receive message encrypt:", data.message)
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
                    console.log("message received - fun -> receive message socket:",data)
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
        console.log("message - fun -> sendMsgSocket",userMessage)
        console.log("user private key - fun -> sendMsgSocket",userPrivateKey)
        console.log("group data - fun -> sendMsgSocket",groupData)
        
        for (let memberId in groupData.members) {
            if(memberId == userId) continue  
            let messageEncrypted = null
            try{
                const memberPublicKey = groupData.members[memberId];
                console.log("group data handle msg", groupData)
                console.log("member public key ->  fun send message group socket:", memberPublicKey)
                messageEncrypted = await shareKeyAndEncrypt(userPrivateKey, memberPublicKey, userMessage["message"])
                console.log("encrypt message - fun -> send message group:",messageEncrypted)
        
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
        console.log("user id - fun -> receiveMsgSocket",userId)
        console.log("user private key - fun -> receiveMsgSocket",userPrivateKey)
        console.log("group data -> fun -> receiveMsgSocket",groupData)

        const handleMessage = async (data) => {
            try{
                const originPublicKey = groupData["members"][data.sender]
                if(!originPublicKey) return null
                console.log("origin public Key - fun -> handleMessage:", originPublicKey)
                console.log("message encrypt:", data.message)
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
                    console.log("message - fun -> receive group message:",data)
                    const newMessage = await handleMessage(data);                
                    resolve(newMessage)
                })
            })
            
            return newMessage ? newMessage : null
        }
    }
