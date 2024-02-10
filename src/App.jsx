import { useEffect, useState } from 'react'
import Login from './components/login/login'
import ListUsers from './components/list_users/list_users'
import Chat from './components/chat/chat'
import Register from './components/register/register'
import CreateGroup from './components/create_group/create_group'
import GroupChat from './components/groupChat/groupChat'
import './App.css'
import { HashRouter as Router, Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import { UserProvider } from './utils/userContext'
import { recoverToken} from './utils/handleSession'

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
        <Route path="/group_chat" element={<GroupChat/>} />
        <Route path="/add_group" element={<CreateGroup/>} />
        <Route path="/users" element={<ListUsers/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/register" element={<Register/>}/>
        <Route exact path="/" element={<Login/>} />
      </Routes>
      </UserProvider>
    </>
  )
}

export default App
