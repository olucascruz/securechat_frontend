import {useEffect, useState } from 'react';
import { useUserContext } from '../../utils/userContext';
import { sendMessageGroupSocket, receiveMessageGroupSocket } from '../../utils/handleMessage'
import {defineGroupUsersIdWithPublicKey} from '../../utils/handleSession';
import { getPublicKey } from '../../service/user_service'

function GroupChat() {
  const {userData, updateGroupData, groupData, keyPair, socket} = useUserContext()

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  

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
      console.log("NewMessage: ", newMessage)
      if(newMessage) setMessages([...messages, newMessage])
    };
  useEffect(()=>{
    const areDependenciesInitialized = socket && userData && keyPair &&groupData;

  if (areDependenciesInitialized) {
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
    return (
      <>
      <h3>
        {userData ? userData["username"]: null} conversando no grupo: {groupData ? groupData["name"]: null} 
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
  
  export default GroupChat
