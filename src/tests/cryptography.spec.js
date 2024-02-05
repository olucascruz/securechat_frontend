/**
 * @jest-environment jsdom
*/

import { JSDOM } from 'jsdom';
const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;


import { generateKeyAndExtractPublic } from "../service/cryptography_service"
import io from 'socket.io-client';
import {shareKeyAndEncrypt, decryptMessage} from "../service/cryptography_service" 
import {loginUser} from "../service/user_service"


describe("crypto", () =>{
    test("should encrypt and decrypt message", async ()=>{
    //Sender
    const ioSender = io("http://127.0.0.1:5000")
    const keyPair = generateKeyAndExtractPublic()
    const senderUsername = "olucas"
    const senderPassword = "asenha"
    
    const responseSenderLogin = await loginUser(senderUsername, senderPassword, keyPair.publicKey)

    console.log("responseLogin", responseSenderLogin.status)
    const senderId = responseSenderLogin.data["id"]
    const receiverId = "4bced20b-4728-4632-8766-6c2b6e406bc2"
    
    const keyPairReceiver = generateKeyAndExtractPublic()
    console.log("keysGenerated")
    const msg = "message test jest"
    const msgEncrypted = await  shareKeyAndEncrypt(keyPair.privateKey, keyPairReceiver.publicKey, msg)
    console.log("messageEncrypted")
    
    ioSender.emit('message', {
        username: senderUsername,
        message: msgEncrypted,
        receiver: receiverId
    });
    console.log("messageEmitted")

    const receivedMessagePromise = new Promise( async (resolve) => {
        const ioReceiver = io("http://127.0.0.1:5000")

        const receiverUsername = "olucas2"
        const receiverPassword = "asenha2"
        const responseReceiverLogin = await loginUser(receiverUsername, receiverPassword, keyPairReceiver.publicKey);
        console.log("receiver do login")
        const handleMessage = async (data) => {
            const newMessage = await decryptMessage(keyPairReceiver.privateKey, keyPair.publicKey, data.message)
            const newData = {
                "username": data.username,
                "message": newMessage
            }
            console.log("SenderMessege:",msg)
            console.log("messageDecrypted: ", newData)
            resolve(newData);
        }

        ioReceiver.on(`message-${receiverId}`, handleMessage)
    });

    ioSender.emit('message', {
        username: senderUsername,
        message: msgEncrypted,
        receiver: receiverId
    });

    const receivedMessage = await receivedMessagePromise

    expect(receivedMessage).toEqual({
        username: senderUsername,
        message: msg,
    });

    }, 20000)
})