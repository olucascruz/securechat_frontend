import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom"
import { defineReceiver, recoverReceiverData} from "../../core/storage/handleSession.js";
import { useUserContext } from '../../core/context/userContext.jsx';

// Definindo o componente de botão estilizado
export const ItemChatStyled = styled.li`
  display: flex;
  width: 60%;
  height: 40px;
  background-color:#292929;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 10px 20px;
  border-radius: 5%;
  border-top: 1px solid #fff;
  color: #fff;

  &:hover {
    background-color: #98a1f39e;
    cursor: pointer;
    border-left: 2px solid #eeff01;
    border-right: 2px solid #eeff01;
    border-top: none;


  }
  /* Estilizando o input do tipo checkbox */
  input[type="checkbox"] {
    /* Oculta o elemento padrão */
    appearance: none; 
    -webkit-appearance: none;
    -moz-appearance: none; 

    /* Define uma largura e altura personalizadas para o marcador */
    width: 20px;
    height: 20px;

    /* Define uma cor de fundo padrão para o marcador */
    background-color: #fff;
    border: 1px solid #ccc;

    /* Adiciona margem e espaçamento */
    margin: 0;
    padding: 0;
  }

  input[type="checkbox"]:checked {
      /* Adiciona uma cor de fundo personalizada */
      background-color: #000000; /* Azul, por exemplo */
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  input[type="checkbox"]:checked::before {
    content: "\\2713"; /* Unicode para o símbolo de marca de seleção */
    font-size: 16px; /* Tamanho do símbolo */
    color: #fff; /* Cor do símbolo */
    /* position: absolute; Posição absoluta para sobrepor o checkbox */
    top: 50%; /* Alinhar verticalmente ao centro */
    left: 50%; /* Alinhar horizontalmente ao centro */
    transform: translate(-50%, -50%); /* Centralizar o símbolo */
  }

  .username{
      font-size: 25px;
      font-weight: bold;
  }

  .onlineImage{
    font-size: 25px;
    right: 0;
  }
`;

const ItemChat = ({user, isToAddGroup = false, selectedUsers=null, setSelectedUsers=null}) =>{
  const navigate = useNavigate()

  const {updateReceiverData} = useUserContext()
  // CÓDIGO É EXECUTADO QUANDO O USUÁRIO SELECIONA UM RECEPTOR
  const handleClickChatWithUser = (param)=> () => {
    console.log("click on user")
    if(!Boolean(user.is_online)) return
    if(isToAddGroup)return
    // Guarda os dados do receptor
    defineReceiver(param)
    setTimeout(() => {
        const recoveredReceiveData = recoverReceiverData()
        updateReceiverData({ type: 'updateAll', payload: recoveredReceiveData});
        navigate("/chat")
      }, 200);
  };

  const handleCheckboxChange = (userId) => () => {
    const isSelected = selectedUsers.includes(userId);

    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const isOnline = user.is_online ? 'online':'offline'

  return(
    <ItemChatStyled 
    className={`btStartChat ${isOnline}`} 
    style={{width:"300px"}} 
    onClick={handleClickChatWithUser(user)}>

      <span className='username'> {user.username} </span>
      
      {isToAddGroup ? 
        <input type="checkbox" 
        checked={selectedUsers.includes(user.id)}
        onChange={handleCheckboxChange(user.id)}/> 
      :
        <span className={`onlineImage ${isOnline}`}>
          {Boolean(user.is_online)? "🟢": "🔴"}
        </span>}

    </ItemChatStyled>
    )

}

export default ItemChat
