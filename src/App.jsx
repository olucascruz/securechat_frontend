import { useEffect, useState } from 'react'
import Login from './components/login/login'
import Chat from './components/chat/chat'
import Register from './components/register/register'
import CreateGroup from './components/createGroup/createGroup'
import GroupChat from './components/groupChat/groupChat'
import './App.css'
import { HashRouter as Router, Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import { UserProvider } from './utils/userContext'
import { recoverToken} from './utils/handleSession'
import ListChat from './components/listChat/ListChat'

function App() {
  const navigate = useNavigate()
  const location = useLocation();
  

  useEffect(()=>{
    const recoveredToken = recoverToken()
    console.log(location)
    if(location.pathname != "/register" && location.pathname != "/"){
      recoveredToken ? null : navigate("/")
    }
  }, [recoverToken])
  
  return (
    <>
      <UserProvider>
      <Routes>
        <Route path="/groupChat" element={<GroupChat/>} />
        <Route path="/createGroup" element={<CreateGroup/>} />
        <Route path="/listChat" element={<ListChat/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/register" element={<Register/>}/>
        <Route exact path="/" element={<Login/>} />
      </Routes>
      </UserProvider>
    </>
  )
}

export default App
