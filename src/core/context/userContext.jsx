import { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { recoverUserData, recoverKeys, recoverReceiverData, recoverToken, recoverGroup  } from '../storage/handleSession'
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

  
  const recoveredReceiverData = recoverReceiverData()
  const [receiverData, updateReceiverData] = useReducer(receiverReducer, recoveredReceiverData);


  const groupReducer = (state, action) => {
    switch (action.type) {
      case 'updateAll':
        return { ...state, ...action.payload };
      case 'updateMembers':
        return { ...state, members: action.payload };
      case 'updateGroupId':
        return { ...state, id: action.payload };
      case 'updateGroupName':
        return { ...state, name: action.payload };
    }
  };

  const recoveredGroup = recoverGroup()
  const [groupData, updateGroupData] = useReducer(groupReducer, recoveredGroup);
  

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
    <UserContext.Provider value={{ token, setToken, userData, setUserData, receiverData, updateReceiverData, keyPair, setKeyPair, socket, setSocket,  groupData, updateGroupData}}>
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