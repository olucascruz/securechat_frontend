import { loginUser } from "../../service/user_service"
import { useNavigate } from "react-router-dom";
import {generateKeyAndExtractPublic} from "../../service/cryptography_service" 
import { useUserContext } from "../../utils/userContext";
import { defineToken, defineUserData, defineUserKeyPair, clearSessionStorage } from "../../utils/handleSession";
import { InputBase } from "../utilsComponents/InputBase";
import { InputPassword } from "../utilsComponents/InputPassword";
import {ButtonSubmit} from "../utilsComponents/ButtonSubmit"
import { FormBase } from "../utilsComponents/FormBase";
import { useEffect } from "react";

function Login() {
    const {setUserData, setToken, setKeyPair, token} = useUserContext()
    const navigate = useNavigate()

    useEffect(()=>{
      clearSessionStorage()
    }, [])
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const usernameInput = document.getElementById("iusername");
        const passwordInput = document.getElementById("ipassword");

        const username = usernameInput.value;
        const password = passwordInput.value;
        
        if(!username || !passwordInput) return

        const keyPair = generateKeyAndExtractPublic()
        console.log(keyPair)
          
        // loga o usuário
        let response;
        try{
          response = await loginUser(username, password, keyPair.publicKey);
        }catch(error){
          console.log("login error>",error)
          return
        }
        console.log(response)

        if(response && response.status == 200){
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
          <FormBase
            onSubmit={handleSubmit}>
            <p style={{ color: 'black' }}>Username</p>
            <InputBase name="iusername" id="iusername" placeholder="username"></InputBase>
            
            <p style={{ color: 'black' }}>Password</p>
            <InputPassword 
              placeholder="password" 
              id="ipassword" 
              type="text" />
            <br />
            <ButtonSubmit> Login </ButtonSubmit>
            <a href="/register"> register </a>
          </FormBase>
        </>
      );
    }
  
  export default Login
  