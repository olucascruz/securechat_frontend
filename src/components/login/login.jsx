import { loginUser } from "../../service/user_service"
import { useEffect } from "react";
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import {generateKeyAndExtractPublic} from "../../service/cryptography_service" 
import { useUserContext } from "../../utils/userContext";
import { defineToken, defineUserData, defineUserKeyPair } from "../../utils/handleSession";


function Login() {
    const {setUserData, setToken, setKeyPair} = useUserContext()
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const usernameInput = document.getElementById("iusername");
        const passwordInput = document.getElementById("ipassword");

        const username = usernameInput.value;
        const password = passwordInput.value;     
        const keyPair = generateKeyAndExtractPublic()
        console.log(keyPair)
          
        // Registre o usuário
        const response = await loginUser(username, password, keyPair.publicKey);
        console.log(response)

        if(response.status == 200){
          const userId = response.data["id"]
          const token = response.data["token"]

          defineUserKeyPair(keyPair.privateKey,
                         keyPair.publicKey)
          
          
          const userdata = {
            "username":username,
            "id":userId
          }
          setUserData(userdata);
          setToken(token)
          defineUserData(username, userId)
          defineToken(token)
          const userKeyPair ={
            "publicKey": keyPair.publicKey,
            "privateKey":keyPair.privateKey
          }
          setKeyPair(userKeyPair)
          navigate('users', { replace: true })
        };
      }
      
    
      return (
        <>
        <h3>Login</h3>
          <form 
            id="formName" 
            onSubmit={handleSubmit}>
            <p>Username</p>
            <input 
              placeholder="username"
              required id="iusername" 
              type="text" />
            <p>Password</p>
            <input 
              placeholder="password" 
              required 
              id="ipassword" 
              type="text" />
            <br />
            <button type="submit"> send </button>
          </form>
          <a href="/register"> register </a>
        </>
      );
    }
  
  export default Login
  