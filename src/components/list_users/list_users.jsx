import { useState, useEffect } from "react"
import { getUsers } from "../../service/user_service.js"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../utils/userContext"
import io from 'socket.io-client';
import { getGroups } from "../../service/group_service.js";
import { defineReceiver, recoverUserData } from "../../utils/handleSession.js";

function ListUsers() {
    const {setReceiverData, receiverData, userData, setUserdata, socket, setSocket} = useUserContext()
    const [users, setUsers] = useState([])
    const [groups, setGroups] = useState([])

    const navigate = useNavigate()

    // CÓDIGO É EXECUTADO QUANDO O COMPONENTE É RENDERIZADO
    useEffect(()=>{
        // Obtém os dados da sessionStorage
        // if(!username) navigate("/")
        const fetchData = async () =>{
            let usersResult = await getUsers()
            if(userData && userData["id"]){
                const usersResultFilted = usersResult.filter(user => user.id !== userData.id);
                console.log("userId:",userData)
                console.log("result:", usersResultFilted)
                const usersArray = Object.keys(usersResultFilted).map(key => ({
                    ...usersResultFilted[key]
                }));
                setUsers(usersArray);
                console.log("users:", usersResult)
            
                const  groupResult = await getGroups(userData["id"])
                console.log("group:", groupResult)
                const groupArray = Object.keys(groupResult).map(key => ({
                    ...groupResult[key]
                }));
                setGroups(groupArray);
            } 
        }
        fetchData()
    },[userData])
    
    // CÓDIGO É EXECUTADO QUANDO O USUÁRIO SELECIONA UM RECEPTOR
    const handleClick = (param) => (event) => {
        // Guarda os dados do receptor
        setReceiverData(param);
        defineReceiver(param)
        setTimeout(() => {
            navigate("/chat")
          }, 5000);
        
    };

    const handleClickCreateGroup = (param) => (event) => {
        navigate("/add_group")
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
                    <button data-value={user.id} className="btStartChat" onClick={handleClick(user)}>
                        start chat
                    </button>
                </li>
                )): null}
            </ul>
            <hr />
            <p>Groups</p><button onClick={handleClickCreateGroup()}>Create group</button>
            <ul id="groups">
                {groups ? groups.map((group, index) => (
                <li key={index}>
                    <span>{group.name}</span>
                    <button data-value={group.id} className="groupButton">
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