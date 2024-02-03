import {useEffect, useState } from 'react';
import { useUserContext } from '../../utils/userContext';
import io from 'socket.io-client';
import { recoverKeys, recoverReceiverData, recoverUserData } from '../../utils/handleSession'
import { sendMessageSocket, receiveMessageSocket } from '../../utils/handleMessage'

function Chat() {
    const {userdata, setUserdata, receiverData, setReceiverData, keys, setKeys, socket, setSocket} = useUserContext()

    const [keyPair, setKeyPair] = useState(false)
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const connectWithSocket = () =>{
      let connection = null
      try{
        connection = io('http://127.0.0.1:5000')
        setSocket(connection)
        console.log("connected")
      }catch(error){
        console.log(error)
      }
    }
    // useEffect(()=>{
    //   connectWithSocket()
      
    //   const userData = recoverUserData()
    //   setUserdata(userData)
    //   const keyPair = recoverKeys()
    //   setKeyPair(keyPair);
    //   const receiver = recoverReceiverData()
    //   setReceiverData(receiver)
      
    //   // if(!username) navigate("/")
    // },[])

    useEffect(()=>{
      const receive = async () => {
        const newMessage = await receiveMessageSocket(socket, userdata["id"], keys.privateKey, receiverData.publicKey)

        setMessages([...messages, newMessage])
      };
      try{
        receive()
      }catch (error) {
        console.error("Erro ao enviar mensagem:", error);
      }
    },[messages, socket])
       
    const sendMessage = async (event) => {
      event.preventDefault();
      // Constrói o objeto da mensagem do usuário atual
      const userMessage = {
        username: userdata["username"],
        message: inputValue
      };

      try {
          // Atualiza o estado com a nova mensagem
          setMessages([...messages, userMessage]);
          // Emite a mensagem via socket para o destinatário
          await sendMessageSocket(socket, userMessage, keys.privateKey, receiverData)
      } catch (error) {
          console.error("Erro ao enviar mensagem:", error);
      }
      setInputValue("")
  };
    return (
      <>
      <h3>
        {userdata["username"]} conversando com {receiverData["username"]} com o id: {receiverData["id"]}
      </h3>
      <div id="chat">
        <p>Chat</p>
        <ul id="msgs">
          {messages.map((message, index)=>{
              return <li key={index}>
                  {message.username}:{message.message}
              </li>
          })}
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
