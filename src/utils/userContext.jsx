import { createContext, useContext, useState, useEffect } from 'react';
import { recoverUserData, recoverKeys, recoverReceiverData, recoverToken  } from './handleSession'
import io from 'socket.io-client';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [userData, setUserData] = useState(null);
  const [receiverData, setReceiverData] = useState(null);
  const [keyPair, setKeyPair] = useState(null);
  const [socket, setSocket] = useState(null);
  
  useEffect(()=>{
    try{
      const receiverRecoved = recoverReceiverData()
      if(!receiverData)setReceiverData(receiverRecoved)
      const userDataRecoved = recoverUserData()
      if(!userData)setUserData(userDataRecoved)

      const keyPairRecoved = recoverKeys()
      const tokenUser = recoverToken()

      if(!token)setToken(tokenUser)
      if(!keyPair)setKeyPair(keyPairRecoved)

      if(token && !socket){
        try{
          let connection = null
          connection = io('http://127.0.0.1:5000')
          setSocket(connection)
          console.log("connected")
        }catch(error){
            console.log(error)
        }
      }
    }catch(error){
      console.log(error)
    }

    
  
  },[token, userData, keyPair, receiverData, socket])
  
  return (
    <UserContext.Provider value={{ token, setToken, userData, setUserData, receiverData, setReceiverData, keyPair, setKeyPair, socket, setSocket }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};