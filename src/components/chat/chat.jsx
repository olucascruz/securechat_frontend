import { useEffect, useState } from 'react';
import {decryptMessage, encryptMessage} from "../../service/cryptography_service.js"
import axios from 'axios';


function Chat({getters}) {
    const {username, setReceiverData, receiverData, keys, socket} = getters
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(()=>{
      // if(!username) navigate("/")
    },[])

    useEffect(()=>{
      if(!socket) return
      socket.on(`message-${username}`, async (data) => {
       
        const newMessage = await decryptData(keys.privateKey, data.message)
        data.message = newMessage
        setMessages([...messages, data])
      })

    }, [socket, messages])

    useEffect(()=>{
      if(!socket) return
      socket.on('jsonChanged', async (data) => {
        const usersArray = Object.keys(data).map(key => ({
          username: key,
          ...result[key]
      }));

      usersArray.forEach(el => {
        if (el.username == username ){
          setReceiverData(el)      
        }
      });
      
      setUsers(usersArray)

      })

    }, [socket])

    
    const sendMessage = async (event) =>{
        event.preventDefault()
        let objMyMsg = {
          user: username,
          message:inputValue
        }
        setMessages([...messages, objMyMsg])
        const message = await encryptData(receiverData.public_key, inputValue)
        socket.emit('message', {user:username, message:message, receiver:receiverData.username});
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
      };

    return (
      <>
        <div id="chat">
            <p>Chat</p>
            <ul id="msgs">
                {messages.map((message, index)=>{
                    return <li key={index}>
                        {message.user}:{message.message}
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

