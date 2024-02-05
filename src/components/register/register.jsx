import { registerUser} from "../../service/user_service.js"
import { useNavigate } from "react-router-dom";
import {generateKeyAndExtractPublic} from "../../service/cryptography_service" 

function Register() {
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
      event.preventDefault();
      
      const usernameInput = document.getElementById("iusername");
      const passwordInput = document.getElementById("ipassword");

      const username = usernameInput.value;
      const password = passwordInput.value;
      const keyPair = generateKeyAndExtractPublic()
      // Registre o usuário
      const response = await registerUser(username, password, keyPair.publicKey); // Supondo que registerUser
      console.log(response) 
      if (response == 200){
        alert("usuário registrado")
      }
      
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
