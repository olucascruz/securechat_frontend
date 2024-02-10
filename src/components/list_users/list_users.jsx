import { useState, useEffect } from "react"
import { getUsers, logoutUser } from "../../service/user_service.js"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../utils/userContext"
import { getGroups } from "../../service/group_service.js";
import { defineReceiver} from "../../utils/handleSession.js";
import { defineToken } from "../../utils/handleSession.js";
import ButtonGroup from "./ButtonGroup.jsx";
import { ListChatStyled } from "./listChatStyle.jsx";
import ItemChat from "./ItemChat.jsx";
function ListUsers() {
    const {updateReceiverData, socket, userData, updateGroupData, keyPair, setToken, token} = useUserContext()
    const [users, setUsers] = useState([])
    const [groups, setGroups] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
  
        // Executa sua função de limpeza ou ação aqui
        const receiverNull = {
          id: '', // Definir um valor padrão vazio se o item não estiver presente
          username:'',
          publicKey: '',
          isOnline:false, 
      }
      defineReceiver(receiverNull)
      updateReceiverData({ type: 'updateAll', payload: receiverNull});
      
    }, []);
  

    const updateUsers = (usersResult) =>{
        const usersResultFiltered = usersResult.filter(user => user.id !== userData.id);
                console.log("user id:",userData)
                console.log("users listed -> fun -> getUsers: ", usersResultFiltered)
                const usersArray = Object.keys(usersResultFiltered).map(key => ({
                    ...usersResultFiltered[key]
                }));
                setUsers(usersArray);
    }
    const updateGroups = (groupResult) =>{
        const groupArray = Object.keys(groupResult).map(key => ({
            ...groupResult[key]
        }));
        setGroups(groupArray);
        console.log("groups (user include) - fun -> getGroups:", groupResult)
    
    }

    // CÓDIGO É EXECUTADO QUANDO O COMPONENTE É RENDERIZADO
    // Responsável por pegar os usuários
    useEffect(()=>{
        console.log("TOKEN: ",token)
        console.log("key pair: ",keyPair)
        if(socket){
            socket.on("new_user_connected", async (data) => {
                fetchData()
            })
        }
        const fetchData = async () =>{
            const  usersResult = await getUsers()
            if(userData && userData["id"]){
                
                updateUsers(usersResult)
                const  groupResult = await getGroups(userData["id"])
                updateGroups(groupResult)
                
            } 
        }
        fetchData()
    },[userData, socket])
    
    

    const handleClickCreateGroup = () => {
        navigate("/add_group")
    }
    

    const handleLogout = () =>{
        setToken("")
        defineToken("")
        logoutUser(userData["id"]) 
        navigate("/")
    }

    

    return (
      <>
      <button onClick={handleLogout} >sair</button>
      <h3> Bem vindo(a) {userData ? userData["username"]: null}</h3>
        <div id="viewUsers">
            <ListChatStyled>
            <p>Grupos - {groups.length}</p><button onClick={handleClickCreateGroup}>
                Create group
            </button>
            <ul id="groups">
                    {groups.length > 0 ? groups.map((group, index) => (
                    
                        <ButtonGroup index={index} group={group}/>
                        
                        
                            
                        
                    
                    )): null}
                </ul>
                </ListChatStyled>
            <h3>Users</h3>
            <ul style={{display:"flex", justifyContent:"center", flexDirection: "column"}} id="users">
                {users ? users.map((user, index) => 
                (
                <ItemChat index={index} user={user}/>

                )): null}
            </ul>
            
        
            

        </div>
      </>
    )
  }
  
  export default ListUsers