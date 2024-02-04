import { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { recoverUserData, recoverKeys, recoverReceiverData, recoverToken  } from './handleSession'
import io from 'socket.io-client';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(recoverToken())
  const [userData, setUserData] = useState(recoverUserData());
  const [keyPair, setKeyPair] = useState(recoverKeys());
  const [socket, setSocket] = useState(null);
  
  const receiverReducer = (state, action) => {
    switch (action.type) {
      case 'updateAll':
        return { ...state, ...action.payload };
      case 'updatePublicKey':
        return { ...state, publicKey: action.payload };
      case 'updateIsOnline':
        return { ...state, isOnline: action.payload };
      
    }
  };

  const initialState = {
    id: '',
    username: '',
    publicKey: '',
    isOnline: false,
  };
  
  const [receiverData, updateReceiverData] = useReducer(receiverReducer, initialState);

  useEffect(()=>{
    try{
      
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
    <UserContext.Provider value={{ token, setToken, userData, setUserData, receiverData, updateReceiverData, keyPair, setKeyPair, socket, setSocket }}>
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