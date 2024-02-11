import { registerUser} from "../../service/user_service.js"
import { useNavigate } from "react-router-dom";
import {generateKeyAndExtractPublic} from "../../service/cryptography_service.js" 
import { RegisterStyled } from "../../components/register/registerStyle.jsx";
import { FormBase } from "../../components/utilsComponents/FormBase.jsx";
import { InputBase } from "../../components/utilsComponents/InputBase.jsx";
import { InputPassword } from "../../components/utilsComponents/InputPassword.jsx";
import logoChatSeguro from '../../assets/logoChatSeguro.png'
import { ButtonSubmit } from "../../components/utilsComponents/ButtonSubmit.jsx";

function Register() {
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
      event.preventDefault();
      
      const usernameInput = document.getElementById("iUsername");
      const passwordInput = document.getElementById("iPassword");

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
    <RegisterStyled>
      <img src={logoChatSeguro} alt="logo chat seguro" />
      <FormBase id={"formRegister"}  onSubmit={handleSubmit}>
        <h3 className={"titleForm"} >Registre sua conta</h3>
        <p className="label">Nome de usuário</p>
        <InputBase placeholder="nome de usuário" required id="iUsername" />
        <p className="label">Senha</p>
        <InputPassword placeholder="senha" required id="iPassword"/>
        <br />
        <ButtonSubmit>Registrar</ButtonSubmit>
        <a href="/" className="linkLogin"> login </a>

      </FormBase>
    </RegisterStyled>
  );
}

export default Register
