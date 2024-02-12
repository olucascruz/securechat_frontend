import {useEffect, useState, useRef} from 'react';
import { useUserContext } from '../../core/context/userContext';
import { sendMessageGroupSocket, receiveMessageGroupSocket } from '../../core/service/handleMessage'
import {defineGroupUsersIdWithPublicKey} from '../../core/storage/handleSession';
import { getPublicKey } from '../../core/service/userService'
import { ChatStyled } from '../../components/chat/ChatStyle';
import MessageBubbleGroup from '../../components/groupChat/MessageBubbleGroup';
import logoChatSeguro from '../../assets/logoChatSeguro.png'
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function GroupChat() {
  const {userData, updateGroupData, groupData, keyPair, socket} = useUserContext()
  const navigate = useNavigate()

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messageListRef = useRef(null);
  useEffect(() => {
    // Mantém o scroll na parte inferior sempre que as mensagens mudarem
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages]);

  useEffect(()=>{
    const fetch = async ()=>{
      if(!groupData) return
      try {
        const membersId = Object.keys(groupData["members"])
        const publicKeys = Object.values(groupData["members"]);
        if(publicKeys[0] != "") return
        let newObjectIdWithKey = {}
        const fetchData = async () => {
          for (const id of membersId) {
            
            try {
              const response = await getPublicKey(id);
              newObjectIdWithKey[id] = response.public_key
                       
            } catch (error) {
              console.error('Erro:', error);
            }
          }
          defineGroupUsersIdWithPublicKey(newObjectIdWithKey)
          updateGroupData({ type: 'updateMembers', 
            payload: newObjectIdWithKey})
        };
        fetchData();
      } catch (error) {
        console.log("errorGetPublicKey", error)
      }finally{
        console.log("groupData with keys:", groupData)
      }
      
    }
    fetch()
  }, [])

  const receive = async () => {
      const newMessage = await receiveMessageGroupSocket(socket, userData["id"], keyPair.privateKey, groupData)
      if(newMessage) setMessages([...messages, newMessage])
    };
  useEffect(()=>{
    const areDependenciesInitialized = socket && userData && keyPair &&groupData;
    const publicKeys = Object.values(groupData["members"]);
  if (areDependenciesInitialized && publicKeys[0] != "") {
    receive();
  }
  
  },[messages, socket, userData, keyPair, groupData])
    

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
          console.log("groupData: ",groupData)
          console.log("privateKeyUser", keyPair)
          console.log("socket: ", socket)

          const areDependenciesInitialized = socket && userMessage && keyPair && groupData;

          if (areDependenciesInitialized) {
            await sendMessageGroupSocket(socket,
                                    userData.id, 
                                    userMessage, 
                                    keyPair.privateKey, 
                                    groupData)
          }
      } catch (error) {
          console.error("Erro ao enviar mensagem:", error);
      }
      setInputValue("")
  };
  const BackListChat = () =>{
    navigate("/listChat")
  }

    return (
      <ChatStyled>
      <header className="headerChat">
      <IoIosArrowBack className="arrowBack" onClick={BackListChat}/>
      <img className="logoChat" src={logoChatSeguro} alt="" onClick={BackListChat}/>
      <h3 className="receiverName">
         {groupData ? groupData["name"]: null} 
      </h3>
      </header>
      
        <p>Chat</p>
        <ul id="msgs" ref={messageListRef}>
          {messages ? messages.map((message, index)=>{
             return <MessageBubbleGroup 
              username={userData.username} 
              key={index}
              message={message}
              />              
              
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
      </ChatStyled>
    )
  }
  
  export default GroupChat
