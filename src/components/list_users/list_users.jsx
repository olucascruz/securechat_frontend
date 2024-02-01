import { useState, useEffect } from "react"
import { getUsers } from "../../service/user_service.js"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../utils/userContext"
import io from 'socket.io-client';
import { getGroups } from "../../service/group_service.js";

function ListUsers() {
    const {setState, setReceiverData, receiverData, userdata, setUserdata, socket, setSocket} = useUserContext()
    const [users, setUsers] = useState([])
    const [groups, setGroups] = useState([])

    const navigate = useNavigate()
    const connectWithSocket = () =>{
        let connection = null
        try{
          connection = io('http://127.0.0.1:5000')
          setSocket(connection)
          
        }catch(error){
          console.log(error)
        }
      }

    // CÓDIGO É EXECUTADO QUANDO O COMPONENTE É RENDERIZADO
    useEffect(()=>{
        connectWithSocket()
        // Obtém os dados da sessionStorage
        const dataName = sessionStorage.getItem("username")
        const dataId = sessionStorage.getItem("userId")
        const recoverData = {"username":dataName, "userId":dataId}

        setUserdata(recoverData)
        // if(!username) navigate("/")
        const fetchData = async () =>{
            let usersResult = await getUsers()
            console.log("result:", usersResult)
            const usersArray = Object.keys(usersResult).map(key => ({
                ...usersResult[key]
            }));
            setUsers(usersArray);
            console.log("users:", usersResult)
            if(dataId){
                const  groupResult = await getGroups(dataId)
                console.log("group:", groupResult)
                const groupArray = Object.keys(groupResult).map(key => ({
                    ...groupResult[key]
                }));
                setGroups(groupArray);
            } 
        }
        fetchData()
    },[])

    // CÓDIGO É EXECUTADO QUANDO O COMPONENTE É RENDERIZADO
    useEffect(()=>{
        if(!socket) return
        socket.on('jsonChanged', async (data) => {
            const usersArray = Object.keys(data).map(key => ({
                username: key,
                ...data[key]
            }));
          setUsers(usersArray)
        })
  
      }, [socket, users])

    
    // CÓDIGO É EXECUTADO QUANDO O USUÁRIO SELECIONA UM RECEPTOR
    const handleClick = (param) => (event) => {
        // Guarda os dados do receptor
        console.log("handleClick receiver data:  ",param)
        setReceiverData(param);
        console.log(receiverData)
        sessionStorage.setItem("receiverId",param.id)
        sessionStorage.setItem("receiverUsername",param.username)
        sessionStorage.setItem("receiverPublicKey",param.public_key)
        sessionStorage.setItem("receiverIsOnline",param.is_online.toString())

        setState("chat");
        navigate("/chat")
    };

    const handleClickCreateGroup = (param) => (event) => {
        setState("add_group");
        navigate("/add_group")
    }
    
    return (
      <>
      <h3> Bem vinde {userdata["username"]}</h3>
        <div id="viewUsers">
            <p>Users</p>
            <ul id="users">
                {users.map((user, index) => (
                <li key={index}>
                    <span>{user.username}:{user.is_online.toString()}</span>
                    <button data-value={user.id} className="btStartChat" onClick={handleClick(user)}>
                        start chat
                    </button>
                </li>
                ))}
            </ul>
            <hr />
            <p>Groups</p><button onClick={handleClickCreateGroup()}>Create group</button>
            <ul id="groups">
                {groups.map((group, index) => (
                <li key={index}>
                    <span>{group.name}</span>
                    <button data-value={group.id} className="groupButton">
                        enter group
                    </button>
                </li>
                ))}
            </ul>

        </div>
      </>
    )
  }
  
  export default ListUsers