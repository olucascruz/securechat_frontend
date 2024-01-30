import { loginUser } from "../../service/user_service"
import {generateKeyPair} from "../../service/keys_service";
import { useEffect } from "react";
import {decryptMessage, encryptMessage} from "../../service/cryptography_service.js"
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

    const connectWithSocket = () =>{
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
          const newKeys = await generateKeyPair()
          keys.publicKey = newKeys.publicKey
          keys.privateKey = newKeys.privateKey
          localStorage.setItem("privateKey", keys.privateKey)
          localStorage.setItem("publicKey", keys.publicKey)
        }

        // Registre o usuário
        loginUser(username, password, keys.publicKey); // Supondo que registerUser 
        // Atualize o estado
        setKeys(keys);
        setUsername(username);
        setState("list_users");
        // connectWithSocket()
        navigate('users', { replace: true })
      };

      
    
      return (
        <>
        <h3>Login</h3>
          <form id="formName" onSubmit={handleSubmit}>
            <p>Username</p>
            <input placeholder="username" required id="iusername" type="text" />
            <p>Password</p>
            <input placeholder="password" required id="ipassword" type="text" />
            <br />
            <button type="submit">send</button>
          </form>
          <a href="/register">register</a>
        </>
      );
    }
  
  export default Login
  