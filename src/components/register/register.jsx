import { registerUser} from "../../service/user_service.js"
import { useNavigate } from "react-router-dom";
import EC from 'elliptic';

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
        
        const ellipicCurve = new EC.ec('secp256k1');
        const keyPair = ellipicCurve.genKeyPair();
        const privateKey = keyPair.getPrivate('hex')
        const publicKey = keyPair.getPublic('hex');
        console.log(keyPair)
        console.log(privateKey)
        console.log(publicKey)
      

        // Registre o usuário
        const response = await registerUser(username, password, publicKey); // Supondo que registerUser 
        if (response == 200){
          alert("usuário registrado")
        }
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
  