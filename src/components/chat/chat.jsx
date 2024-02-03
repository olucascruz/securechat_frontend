import {useEffect, useState } from 'react';
import { useUserContext } from '../../utils/userContext';
import { sendMessageSocket, receiveMessageSocket } from '../../utils/handleMessage'
import { recoverReceiverData } from '../../utils/handleSession';

function Chat() {
    const {userData,receiverData, setReceiverData,keyPair, socket} = useUserContext()

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    
    const receive = async () => {
      const newMessage = await receiveMessageSocket(socket, userData["id"], keyPair.privateKey, receiverData.publicKey)
      console.log("NewMessage: ", newMessage)
      if(newMessage) setMessages([...messages, newMessage])
    };
  useEffect(()=>{
    const receiverRecoved = recoverReceiverData()
    if(!receiverData)setReceiverData(receiverRecoved)
    const areDependenciesInitialized = socket && userData && keyPair && receiverData;

  if (areDependenciesInitialized) {
    receive();
  }
  
  },[messages, socket, userData, keyPair, receiverData])
    

    const sendMessage = async (event) => {
      event.preventDefault();
      if(!inputValue) return
      try {
          // Constrói o objeto da mensagem do usuário atual
          const userMessage = {
            username: userData["username"],
            message: inputValue
          };
  
          // Atualiza o estado com a nova mensagem
          setMessages([...messages, userMessage]);
          // Emite a mensagem via socket para o destinatário
          console.log("receiverData: ",receiverData)
          console.log("privateKeyUser", keyPair)
          console.log("socket: ", socket)

          const areDependenciesInitialized = socket && userMessage && keyPair && receiverData;

          if (areDependenciesInitialized) {
            await sendMessageSocket(socket, 
                                    userMessage, 
                                    keyPair.privateKey, 
                                    receiverData)
          }
      } catch (error) {
          console.error("Erro ao enviar mensagem:", error);
      }
      setInputValue("")
  };
    return (
      <>
      <h3>
        {userData ? userData["username"]: null} conversando com {receiverData ? receiverData["username"]: null} com o id: {receiverData ? receiverData["id"]: null}
      </h3>
      <div id="chat">
        <p>Chat</p>
        <ul id="msgs">
          {messages ? messages.map((message, index)=>{
              return <li key={index}>
                  {message.username}:{message.message}
              </li>
          }): null}
        </ul>
        <form id="formMsg">   
          <input name='iMsg'
            id="iMsg"
            type="text"
            value={inputValue}
            onChange={(event)=>setInputValue(event.target.value)}/>
          <button onClick={sendMessage} type="submit">send</button>
        </form>
      </div>
      </>
    )
  }
  
  export default Chat
