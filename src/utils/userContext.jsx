import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, setState] = useState('login');
  const [userdata, setUserdata] = useState('');
  const [receiverData, setReceiverData] = useState({});
  const [keys, setKeys] = useState({});
  const [socket, setSocket] = useState(false);
  

  return (
    <UserContext.Provider value={{ state, setState, userdata, setUserdata, receiverData, setReceiverData, keys, setKeys, socket, setSocket }}>
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