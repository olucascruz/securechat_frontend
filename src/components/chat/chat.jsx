import {useEffect, useState } from 'react';
import { useUserContext } from '../../utils/userContext';
import EC from 'elliptic';
import io from 'socket.io-client';
import {shareKeyAndEncrypt, decryptMessage} from "../../service/cryptography_service" 

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
    useEffect(()=>{
      connectWithSocket()
      // console.log("receiver data:",receiverData)
      const dataName = sessionStorage.getItem("username")
      const dataId = sessionStorage.getItem("userId")
      const recoverData = {"username":dataName, "id":dataId}

      setUserdata(recoverData)
      const ec_1 = new EC.ec('secp256k1');
      const dataPrivateKey = sessionStorage.getItem("privateKey")
      setKeyPair(ec_1.keyFromPrivate(dataPrivateKey, 'hex'));
      const new_keys = {"privateKey":dataPrivateKey}
      setKeys(new_keys)


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
      console.log(receiverData)

      setReceiverData(receiverData)
      // if(!username) navigate("/")
    },[])

    useEffect(()=>{
      const handleMessage = async (data) => {
        console.log("message",data);
        console.log("message",data);
        const newMessage = await decryptMessage(keys.privateKey,receiverData.publicKey, data.message)
        console.log("newMessage:",newMessage)
        const new_data = {"username":data.username,
                    "message":newMessage}
        setMessages(prevMessages => [...prevMessages, new_data]);
      };
      if(socket) socket.on(`message-${userdata["id"]}`, handleMessage);
    },[messages, socket])
    
    const sendMessage = async (event) => {
      try {
          event.preventDefault();
          console.log("receiverPublicKey",sessionStorage.getItem("receiverPublicKey"))
          // Constrói o objeto da mensagem do usuário atual
          const userMessage = {
              username: userdata["username"],
              message: inputValue
          };
          
          // Atualiza o estado com a nova mensagem
          setMessages([...messages, userMessage]);
  
          // Emite a mensagem via socket para o destinatário
          console.log("receiver", receiverData);
          if(!socket) return
          console.log("before encrypted")
          const messageEncrypted = await shareKeyAndEncrypt(keys.privateKey, receiverData.publicKey, inputValue)
          console.log("encrypted")
          console.log("messageEncrypted:", messageEncrypted)
          socket.emit('message', {
              username: userdata["username"],
              message: messageEncrypted,
              receiver: receiverData.id 
          });

      setInputValue("")
      } catch (error) {
          console.error("Erro ao enviar mensagem:", error);
          // Adicione aqui o tratamento adequado para o erro, se necessário
      }
  };
  

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
      };

    return (
      <>
      <h3>{userdata["username"]} conversando com {receiverData["username"]} com o id: {receiverData["id"]}</h3>
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
                 onChange={handleInputChange}/>
                <button onClick={sendMessage} type="submit">send</button>
            </form>
        </div>
      </>
    )
  }
  
  export default Chat

