import { useEffect, useState } from 'react'
import Login from './pages/login/Login'
import Chat from './pages/chat/Chat'
import Register from './pages/register/Register'
import CreateGroup from './pages/createGroup/CreateGroup'
import GroupChat from './pages/chat/GroupChat'
import './App.css'
import { HashRouter as Router, Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import { UserProvider } from './core/context/userContext'
import { recoverToken} from './core/storage/handleSession'
import ListChat from './pages/listChat/ListChat'

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
