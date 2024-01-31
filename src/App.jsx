import { useEffect, useState } from 'react'
import Login from './components/login/login'
import ListUsers from './components/list_users/list_users'
import Chat from './components/chat/chat'
import Register from './components/register/register'
import axios from 'axios'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const [state, setState] = useState("login")
  const [userdata, setUserdata] = useState("")
  const [receiverData, setReceiverData] = useState({})
  const [keys, setKeys] = useState({})
  const [socket, setSocket] = useState(false);
  
  useEffect(()=>{
    return async () => {
      // resoponse_logout = await axios.post("http://127.0.0.1:5000/logout", {"username":username})
    };
  },[])
  
  return (
    <>
      {/* {switchComponent()} */}
      <Routes>
        
        <Route path="/users" element={<ListUsers setters={{ setState, setReceiverData, userdata, socket }} />} />
        <Route path="/chat" element={<Chat getters={{ userdata, setReceiverData, receiverData, keys, socket }} />} />
        <Route path="/register" element={<Register setters={{ setState}} />} />
        <Route exact path="/" element={<Login setters={{ setState, setUserdata, setKeys, setSocket}} />} />
      </Routes>
    </>
  )
}

export default App
