import React from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom"
import { defineReceiver, recoverReceiverData} from "../../utils/handleSession.js";
import { useUserContext } from '../../utils/userContext.jsx';
// Definindo o componente de botão estilizado
export const ItemChatStyled = styled.li`
  display: flex;
  width: 100%;
  height: 40px;
  background-color:#0b345e;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 10px 20px;
  border-radius: 5%;
  border-top: 1px solid #fff;

  &:hover {
    background-color: #98a1f39e;
    cursor: pointer;
    border-left: 2px solid #eeff01;
    border-right: 2px solid #eeff01;
    border-top: none;


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

const ItemChat = ({index, user}) =>{
  const {updateReceiverData} = useUserContext()
  // CÓDIGO É EXECUTADO QUANDO O USUÁRIO SELECIONA UM RECEPTOR
  const handleClickChatWithUser = (param)=> () => {
    if(!Boolean(user.is_online)) return
    // Guarda os dados do receptor
    defineReceiver(param)
    const navigate = useNavigate()
    setTimeout(() => {
        const recoveredReceiveData = recoverReceiverData()
        updateReceiverData({ type: 'updateAll', payload: recoveredReceiveData});
        navigate("/chat")
      }, 200);
    
  };
  return(
    <ItemChatStyled key={index} className="btStartChat" style={{width:"300px"}} onClick={handleClickChatWithUser(user)}>
      <span className='username'> {user.username}</span>
      <span className='onlineImage'>{Boolean(user.is_online)? "🟢": "🔴"}</span>
    </ItemChatStyled>
    )

}

export default ItemChat
