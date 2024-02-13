import { loginUser } from "../../core/service/userService.js"
import { useNavigate } from "react-router-dom";
import {generateKeyAndExtractPublic} from "../../core/crypto/encryptionUtils" 
import { useUserContext } from "../../core/context/userContext";
import { defineToken, defineUserData, defineUserKeyPair, clearSessionStorage } from "../../core/storage/handleSession";
import { InputBase } from "../../components/utilsComponents/InputBase";
import { InputPassword } from "../../components/utilsComponents/InputPassword";
import {ButtonSubmit} from "../../components/utilsComponents/ButtonSubmit"
import { FormBase } from "../../components/utilsComponents/FormBase";
import { useEffect } from "react";
import { LoginStyled } from "../../components/login/loginStyle";
import logoChatSeguro from '../../assets/logoChatSeguro.png'

function Login() {
    const {setUserData, setToken, setKeyPair, token} = useUserContext()
    const navigate = useNavigate()

    useEffect(()=>{
      clearSessionStorage()
    }, [])
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const usernameInput = document.getElementById("iUsername");
        const passwordInput = document.getElementById("iPassword");

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
          
          
          const dataUser = {
            "username":username,
            "id":userId
          }
          setUserData(dataUser);
          setToken(token)
          defineUserData(username, userId)
          defineToken(token)
          const userKeyPair ={
            "publicKey": keyPair.publicKey,
            "privateKey":keyPair.privateKey
          }
          setKeyPair(userKeyPair)
          navigate('listChat', { replace: true })
        };
      }
      
    
      return (
        <LoginStyled>
          <img src={logoChatSeguro} alt="logo chat seguro" />
          <FormBase
            onSubmit={handleSubmit}
            id={"formLogin"}>
            <h3 className="titleForm" >Login</h3>
          
            <p className="label">Nome de usuário</p>
            <InputBase name="iUsername" id="iUsername" placeholder="nome de usuário"></InputBase>
            
            <p className="label">Senha</p>
            <InputPassword 
              placeholder="senha" 
              id="iPassword" 
              type="text" />
            <br />
            <ButtonSubmit> Entrar </ButtonSubmit>
            <a href="/register"
            className="linkRegister"
            > register </a>
          </FormBase>

          </LoginStyled>
      );
    }
  
  export default Login
  