import { useEffect, useState } from 'react'
import Login from './components/login/login'
import ListUsers from './components/list_users/list_users'
import Chat from './components/chat/chat'
import Register from './components/register/register'
import axios from 'axios'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './utils/userContext'

function App() {  
  useEffect(()=>{
    return async () => {
      // resoponse_logout = await axios.post("http://127.0.0.1:5000/logout", {"username":username})
    };
  },[])
  
  return (
    <>
      {/* {switchComponent()} */}
      <UserProvider>
      <Routes>
        
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
