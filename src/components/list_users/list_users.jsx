import { useState, useEffect } from "react"
import { getUsers } from "../../service/user_service.js"
import { useNavigate } from "react-router-dom"
useNavigate

function ListUsers({setters}) {
    const {setState, setReceiverData, username, socket} = setters
    const [users, setUsers] = useState([])
    const navigate = useNavigate()


    useEffect(()=>{
        console.log(username)
        // if(!username) navigate("/")
        const fetchData = async () =>{
            let result = await getUsers()
            console.log("result:",result)
            const usersArray = Object.keys(result).map(key => ({
                ...result[key]
            }));
            setUsers(usersArray);
            console.log("users:", users)
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

    const handleClick = (param) => (event) => {
        setReceiverData(param);
        setState("chat");
        navigate("/chat")
    };
    
    return (
      <>
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
        </div>
      </>
    )
  }
  
  export default ListUsers