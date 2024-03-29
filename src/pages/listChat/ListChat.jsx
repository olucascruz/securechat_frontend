import { useState, useEffect } from "react"
import { getUsers, logoutUser } from "../../core/service/userService.js"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../core/context/userContext.jsx"
import { getGroups } from "../../core/service/groupService.js";
import { defineReceiver, defineToken} from "../../core/storage/handleSession.js";
import ButtonGroup from "../../components/listChat/ButtonGroup.jsx";
import { ListChatStyled } from "../../components/listChat/ListChatStyle.jsx";
import ItemChat from "../../components/listChat/ItemChat.jsx";

function ListChat() {
    const {updateReceiverData, socket, userData, keyPair, setToken, token} = useUserContext()
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

    const fetchData = async () =>{
        const usersResult = await getUsers()
        if(userData && userData["id"]){
            
            const  groupResult = await getGroups(userData["id"])
            console.log("groupResult", groupResult)
            updateGroups(groupResult)  
            updateUsers(usersResult)

        } 
    }
    
    // Responsável por pegar os usuários
    useEffect(()=>{
        console.log("TOKEN: ",token)
        console.log("key pair: ",keyPair)
        if(socket){
            socket.on("new_user_connected", async (data) => {
                fetchData()
            })
        }

        fetchData()
    },[userData, socket])
    
    
    const handleClickCreateGroup = () => {
        navigate("/createGroup")
    }
    

    const handleLogout = () =>{
        setToken("")
        defineToken("")
        logoutUser(userData["id"]) 
        navigate("/")
    }

    
    return (
    <ListChatStyled>
      <header className="headerChat">
        <button className="buttonLogout" onClick={handleLogout} >sair</button>
      </header>
      <h3> Bem vindo(a) {userData ? userData["username"]: null}</h3>
             
        <div className="headerSectionGroups">
            <p className="titleList" >
                Grupos - {groups ? groups.length: null}
            </p>
            <button className="buttonCreateGroup" onClick={handleClickCreateGroup}>
                +
            </button>
        </div>
        
        <ul id="groups">
            {groups ? groups.map((group, index) => 
            (
                <ButtonGroup key={`group_${index}_${group.id}`} group={group} users={users}/>
            )): null}
        </ul>
        <p className="titleList">Users</p>
        <ul id="users">
            {users ? users.map((user, index) => 
            (
            <ItemChat key={`user_${index}_${user.id}`} user={user}/>

            )): null}
        </ul>
              
    </ListChatStyled>
    )
  }
  
  export default ListChat