import { useState, useEffect } from "react"
import { getUsers } from "../../service/user_service.js"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../utils/userContext"
import io from 'socket.io-client';
import { createGroups } from "../../service/group_service.js";

function CreateGroup() {
    const {setState, socket, userdata} = useUserContext()
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([]);
    
    const navigate = useNavigate()
    

    // CÓDIGO É EXECUTADO QUANDO O COMPONENTE É RENDERIZADO
    useEffect(()=>{
        // Obtém os dados da sessionStorage
        const dataName = sessionStorage.getItem("username")
        const dataId = sessionStorage.getItem("userId")
        
        // if(!username) navigate("/")
        const fetchData = async () =>{
            let usersResult = await getUsers()
            console.log("result:", usersResult)
            const usersArray = Object.keys(usersResult).map(key => ({
                ...usersResult[key]
            }));
            setUsers(usersArray);
            console.log("users:", usersResult)        
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


    const handleCheckboxChange = (userId) => {
    // Verifica se o usuário já está na lista de selecionados
    const isSelected = selectedUsers.includes(userId);

    if (isSelected) {
      // Se estiver, remove o usuário da lista de selecionados
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      // Se não estiver, adiciona o usuário à lista de selecionados
      setSelectedUsers([...selectedUsers, userId]);
    }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const nameGroupInput = document.getElementById("nameGroup");
        const nameGroup  = nameGroupInput.value
        
        if(!nameGroup) return
        if(selectedUsers.length < 2) return
        console.log("selected users")
        createGroups(nameGroup, selectedUsers)
    }
    return (
      <>
      <h3> Seja um adm: {userdata["username"]}</h3>
        <div id="viewUsers">
            <p>Crie um grupo</p>
            <form id="formCreateGroup" onSubmit={handleSubmit}>
                <label htmlFor="nameGroup">name group:</label>
                <br />
                <input placeholder="name group" type="text" name="nameGroup" id="nameGroup" />
                <br />
                <p><b>Select members for group:</b></p>
                <ul id="users">
                    {users.map((user, index) => (
                    <li key={index}>
                        <span>{user.username}:{user.is_online.toString()}</span>
                        <input type="checkbox"
                        name={user.username}
                        id={user.id}
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleCheckboxChange(user.id)}
                        />
                    </li>
                    ))}
                </ul>
                <hr />
                <button type="submit"> Create Group </button>
                <br />
                <br />
                <button onClick={() => {
                        setState("list_users");
                        navigate('/users')
                }}> back </button>
            </form>
        </div>
      </>
    )
  }
  
  export default CreateGroup