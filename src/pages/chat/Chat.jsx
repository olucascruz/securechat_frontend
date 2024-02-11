import {useEffect, useState, useRef } from 'react';
import { useUserContext } from '../../utils/userContext';
import { sendMessageSocket, receiveMessageSocket } from '../../utils/handleMessage'
import {defineReceiverPublicKey} from '../../utils/handleSession';
import { getPublicKey } from '../../service/user_service'
import { ChatStyled } from '../../components/chat/ChatStyle';
import logoChatSeguro from '../../assets/logoChatSeguro.png'
import MessageBubble from '../../components/chat/MessageBubble';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function Chat() {
  const {userData, setToken, defineToken, receiverData, updateReceiverData, keyPair, socket} = useUserContext()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messageListRef = useRef(null);
  
  useEffect(() => {
    // Mantém o scroll na parte inferior sempre que as mensagens mudarem
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages]);

  const BackListChat = () =>{
    navigate("/listChat")
  }
  useEffect(()=>{
    const fetch = async ()=>{
      console.log("receiver data: ",receiverData)
      if(!receiverData) return
      try {
        const response = await getPublicKey(receiverData.id)
        if(receiverData.publicKey != response.public_key){
          updateReceiverData({ type: 'updatePublicKey', payload: response.public_key});
          defineReceiverPublicKey(response.public_key)
        }
      } catch (error) {
        console.log("errorGetPublicKey", error)
      }
      
    }
    fetch()

  }, [receiverData])

  
  const receive = async () => {
      const newMessage = await receiveMessageSocket(socket, userData["id"], keyPair.privateKey, receiverData.publicKey)
      console.log("NewMessage: ", newMessage)
      if(newMessage) setMessages([...messages, newMessage])
    };
  useEffect(()=>{
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
      <ChatStyled>
      <header className="headerChat">
      <IoIosArrowBack className="arrowBack" onClick={BackListChat}/>
      <img className="logoChat" src={logoChatSeguro} alt="" onClick={BackListChat}/>
      <h3 className="receiverName">
          {receiverData ? receiverData["username"]: null}
      </h3>
      </header>
        <ul id="msgs" ref={messageListRef}>
          {messages ? messages.map((message, index)=>{
              return <MessageBubble
               username={userData.username}
               index={index}
               message={message}></MessageBubble>
          }): null}
        </ul>
        <form id="formMsg">   
          <input
           name='iMsg'
            id="iMsg"
            type="text"
            value={inputValue}
            onChange={(event)=>setInputValue(event.target.value)}/>
          <button onClick={sendMessage} type="submit">send</button>
        </form>
        </ChatStyled>
    )
  }
  
  export default Chat
