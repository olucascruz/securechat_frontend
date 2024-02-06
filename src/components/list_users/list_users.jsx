import { useState, useEffect } from "react"
import { getUsers } from "../../service/user_service.js"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../utils/userContext"
import { getGroups } from "../../service/group_service.js";
import { defineReceiver, recoverReceiverData, defineGroup, recoverGroup} from "../../utils/handleSession.js";

function ListUsers() {
    const {updateReceiverData, userData, updateGroupData, keyPair} = useUserContext()
    const [users, setUsers] = useState([])
    const [groups, setGroups] = useState([])

    const navigate = useNavigate()

    // CÓDIGO É EXECUTADO QUANDO O COMPONENTE É RENDERIZADO
    //Responsavel por pegar os usuários
    useEffect(()=>{
        console.log("key pair: ",keyPair)
        const fetchData = async () =>{
            let usersResult = await getUsers()
            if(userData && userData["id"]){
                const usersResultFilted = usersResult.filter(user => user.id !== userData.id);
                console.log("user id:",userData)
                console.log("users listed -> fun -> getUsers: ", usersResultFilted)
                const usersArray = Object.keys(usersResultFilted).map(key => ({
                    ...usersResultFilted[key]
                }));
                setUsers(usersArray);
            
                const  groupResult = await getGroups(userData["id"])
                
                const groupArray = Object.keys(groupResult).map(key => ({
                    ...groupResult[key]
                }));
                setGroups(groupArray);
                console.log("groups (user include) - fun -> getGroups:", groupResult)

            } 
        }
        fetchData()
    },[userData])
    
    // CÓDIGO É EXECUTADO QUANDO O USUÁRIO SELECIONA UM RECEPTOR
    const handleClickChatWithUser = (param)=> () => {
        // Guarda os dados do receptor
        defineReceiver(param)
        
        setTimeout(() => {
            const recovedReceiveData = recoverReceiverData()
            updateReceiverData({ type: 'updateAll', payload: recovedReceiveData});
            navigate("/chat")
          }, 200);
        
    };

    const handleClickCreateGroup = () => {
        navigate("/add_group")
    }

    const handleClickChatWithGroup = (param) => () =>{
        defineGroup(param)

        setTimeout(() => {
            const recovedGroupData = recoverGroup()
            updateGroupData({ type: 'updateAll', 
            payload: recovedGroupData})
            navigate("/group_chat")
          }, 200);
    }
    
    return (
      <>
      <h3> Bem vindo(a) {userData ? userData["username"]: null}</h3>
        <div id="viewUsers">
            <p>Users</p>
            <ul id="users">
                {users ? users.map((user, index) => (
                <li key={index}>
                    <span>{user.username}:{user.is_online.toString()}</span>
                    <button data-value={user.id} className="btStartChat" onClick={handleClickChatWithUser(user)}>
                        start chat
                    </button>
                </li>
                )): null}
            </ul>
            <hr />
            <p>Groups - {groups.length}</p>
            <button onClick={handleClickCreateGroup}>
                Create group
            </button>
            <ul id="groups">
                {groups.length > 0 ? groups.map((group, index) => (
                <li key={index}>
                    <span>{group.name}</span>
                    <button 
                    data-value={group.id} 
                    onClick={handleClickChatWithGroup(group)} className="groupButton">
                    enter group
                    </button>
                </li>
                )): null}
            </ul>

        </div>
      </>
    )
  }
  
  export default ListUsers