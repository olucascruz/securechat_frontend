import { useEffect, useState } from 'react'
import Login from './components/login/login'
import ListUsers from './components/list_users/list_users'
import Chat from './components/chat/chat'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const [state, setState] = useState("login")
  const [username, setUsername] = useState("")
  const [receiverData, setReceiverData] = useState({})
  const [keys, setKeys] = useState({})
  const [socket, setSocket] = useState(false);
  
  useEffect(()=>{
    return async () => {
      socket.disconnect();
      resoponse_logout = await axios.post("http://127.0.0.1:5000/logout", {"username":username})
    };
  },[])
  
  return (
    <>
      {/* {switchComponent()} */}
      <Routes>
        
        <Route path="/users" element={<ListUsers setters={{ setState, setReceiverData, username, socket }} />} />
        <Route path="/chat" element={<Chat getters={{ username, setReceiverData, receiverData, keys, socket }} />} />
        <Route exact path="/" element={<Login setters={{ setState, setUsername, setKeys, setSocket }} />} />
      </Routes>
    </>
  )
}

export default App
