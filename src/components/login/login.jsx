import { registerUser} from "../../service/user_service"
import {genarateKeys} from "../../service/keys_service";
import { useEffect } from "react";
import {decryptData, encryptData} from "../../service/cryptography_service.js"
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";


function Login({setters}) {
    const { setState, setUsername, setKeys, setSocket } = setters;
    let keys = {"privateKey":"",
                "publicKey":""}
    const navigate = useNavigate()

    useEffect(()=>{

      let privateKey = localStorage.getItem("privateKey")
      let publicKey = localStorage.getItem("publicKey")
      keys.privateKey = privateKey
      keys.publicKey = publicKey
    
    },[])

    const connect_with_socket = () =>{
      let connection = null
      try{
        connection = io('http://127.0.0.1:5000')
        setSocket(connection)
        
      }catch(error){
        console.log(error)
      }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const usernameInput = document.getElementById("iusername");
        const username = usernameInput.value;
        if(!keys.privateKey){
          const newKeys = await genarateKeys()
          keys.publicKey = newKeys.publicKey
          keys.privateKey = newKeys.privateKey
          localStorage.setItem("privateKey", keys.privateKey)
          localStorage.setItem("publicKey", keys.publicKey)
        }

        // Registre o usuário
        registerUser(username, keys.publicKey); // Supondo que registerUser requer um username e uma publicKey
        // const message = await encryptData(keys.publicKey, "ola mundo")
        // const newMessage = await decryptData(keys.privateKey, message)
        // console.log(newMessage)
        // Atualize o estado
        setKeys(keys);
        setUsername(username);
        setState("list_users");
        connect_with_socket()
        navigate('users', { replace: true })
      };

      
    
      return (
        <>
          <form id="formName" onSubmit={handleSubmit}>
            <p>Username</p>
            <input required id="iusername" type="text" />
            <button type="submit">send</button>
          </form>
        </>
      );
    }
  
  export default Login
  