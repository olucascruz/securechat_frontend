import { loginUser } from "../../service/user_service"
import { useEffect } from "react";
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import crypto from 'crypto';
import EC from 'elliptic';
import { useUserContext } from "../../utils/userContext";


function Login() {
    const { setState, setUserdata, setKeys, setSocket } = useUserContext()
    let keys = {"privateKey":"",
                "publicKey":"",
                "keyPair":"",
                "ec":""}
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
        const passwordInput = document.getElementById("ipassword");

        const username = usernameInput.value;
        const password = passwordInput.value;


        
        const ellipicCurve = new EC.ec('secp256k1');
        const keyPair = ellipicCurve.genKeyPair();
        const publicKey = keyPair.getPublic('hex');
        keys.publicKey = keyPair.getPublic('hex')
        keys.privateKey = keyPair.getPrivate('hex')
        keys.keyPair = keyPair
        keys.ec = ellipicCurve

        

        
        // Registre o usuário
        const response = await loginUser(username, password, publicKey);
        console.log(response)

        if(response.status == 200){
          const userId = response.data["id"]
          sessionStorage.setItem("privateKey", keys.privateKey);
          sessionStorage.setItem("publicKey", keys.publicKey);
          sessionStorage.setItem("username", username);
          sessionStorage.setItem("userId", userId);


          // Atualize o estado
          setKeys(keys);
          const userdata = {
            "username":username,
            "userId":userId
          }
          setUserdata(userdata);
          setState("list_users");
          connectWithSocket()
          navigate('users', { replace: true })
        };
      }
      
    
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
  