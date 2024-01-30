import { registerUser} from "../../service/user_service.js"
import {generateKeyPair} from "../../service/keys_service.js";
import { useNavigate } from "react-router-dom";


function Register({setters}) {
    const { setState, setUsername, setKeys} = setters;
    let keys = {"privateKey":"",
                "publicKey":""}
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const usernameInput = document.getElementById("iusername");
        const passwordInput = document.getElementById("ipassword");

        const username = usernameInput.value;
        const password = passwordInput.value;
        if(!keys.privateKey){
          const newKeys = await generateKeyPair()
          keys.publicKey = newKeys.publicKey
          keys.privateKey = newKeys.privateKey
          console.log(newKeys.publicKey)
          localStorage.setItem("privateKey", keys.privateKey)
          localStorage.setItem("publicKey", keys.publicKey)
        }

        // Registre o usuário
        registerUser(username, password, keys.publicKey); // Supondo que registerUser 

        // Atualize o estado
        setState("login");
        navigate('', { replace: true })
      };

      
    
      return (
        <>
        <h3>Registre sua conta</h3>
          <form id="formName" onSubmit={handleSubmit}>
          <p>Username</p>
            <input placeholder="username" required id="iusername" type="text" />
            <p>Password</p>
            <input placeholder="password" required id="ipassword" type="text" />
            <br />
            <button type="submit">Registrar</button>
          </form>
        <a href="/"> login</a>
        </>
      );
    }
  
  export default Register
  