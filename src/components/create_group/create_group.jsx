import { useState, useEffect } from "react"
import { getUsers } from "../../service/user_service.js"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../utils/userContext"
import { createGroups } from "../../service/group_service.js";

function CreateGroup() {
    const {socket, userData} = useUserContext()
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([userData.id]);
    
    const navigate = useNavigate()
    

    useEffect(()=>{
        const dataName = sessionStorage.getItem("username")
        const dataId = sessionStorage.getItem("userId")
        
        // if(!username) navigate("/")
        const fetchData = async () =>{
            let usersResult = await getUsers()
            const usersResultFiltered = usersResult.filter(user => user.id !== userData.id);
            console.log("result:", usersResult)
            const usersArray = Object.keys(usersResultFiltered ).map(key => ({
                ...usersResultFiltered [key]
            }));
            
            setUsers(usersArray);    
        }
        
        fetchData()   
    },[])

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
      const isSelected = selectedUsers.includes(userId);

      if (isSelected) {
        setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      } else {
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
        const response =  createGroups(nameGroup, selectedUsers)
        if(response == 200){
          alert("groupCreated")
        }
    }
    return (
      <>
      <h3> Seja um adm: {userData["username"]}</h3>
      <div id="viewUsers">
        <p> Crie um novo grupo </p>
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
            <button onClick={()=>navigate('/users')}> back </button>
        </form>
      </div>
      </>
    )
  }
  
  export default CreateGroup