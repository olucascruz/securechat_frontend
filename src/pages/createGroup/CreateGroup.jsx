import { useState, useEffect } from "react"
import { getUsers } from "../../service/user_service.js"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../utils/userContext.jsx"
import { createGroups } from "../../service/group_service.js";
import { ListChatStyled } from "../../components/listChat/ListChatStyle.jsx";
import ItemChat from "../../components/listChat/ItemChat.jsx";
import { InputBase } from "../../components/utilsComponents/InputBase.jsx";
import { FormBase } from "../../components/utilsComponents/FormBase.jsx"
import { ButtonSubmit } from "../../components/utilsComponents/ButtonSubmit.jsx"
import { ButtonBase } from "../../components/utilsComponents/ButtonBase.jsx";

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
      <ListChatStyled>
      <div id="viewUsers">
        <FormBase notColor={true} id="formCreateGroup" onSubmit={handleSubmit}>
            <p className="titleList"> Crie um novo grupo </p>
            <label htmlFor="nameGroup">Nome do grupo:</label>
            <br />
            <InputBase placeholder="nome do grupo" type="text" name="nameGroup" id="nameGroup" />
            <br />
            <p className="titleList">Selecione os membros do grupo:</p>
            <ul id="users">
              {users.map((user, index) => (
                <ItemChat key={`user_${index}_${user.id}`} user={user} isToAddGroup={true} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>
              ))}
            </ul>
            <br />
            <ButtonSubmit>Create Group</ButtonSubmit>
            {/* <Button type="submit">  </button> */}
            <br />
            <br />
            <ButtonBase onClick={()=>navigate('/listChat')}> voltar </ButtonBase>
        </FormBase>
      </div>
      </ListChatStyled>
    )
  }
  
  export default CreateGroup