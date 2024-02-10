import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {  getIsOnline } from "../../service/user_service.js"

// Definindo o componente de botão estilizado
const StyledButton = styled.li`
  padding: 10px 10px 10px 10px;
  font-size: 16px;
  background-color: #0b345e;
  color: white;
  border: none;
  border-radius: 1px;
  cursor: pointer;
  border-top: #ffffff solid 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(30, 144, 255); /* Tom mais escuro ao passar o mouse */
  }

  &:focus {
    outline: none; /* Remove a borda padrão ao focar */
  }
    /* Estilo quando o botão está desabilitado */
    &:disabled {
    background-color: #ccc; /* Cor de fundo mais clara */
    color: #666; /* Cor do texto mais suave */
    cursor: not-allowed; /* Cursor não disponível */
  }
`;

// Componente funcional que renderiza o botão estilizado
const ButtonGroup = ({ group, index }) => {
    const [isDisabled, setDisabled] = useState(true) 
    useEffect(()=>{
        const checkIsDisabled = async () =>{
        
            let membersOnline = [];
            console.log("what is a group:", group)
            // Usando forEach para iterar sobre os membros do grupo
            await Promise.all(group.members.map(async (member) => {
                const response = await getIsOnline(member);
                const memberIsOnline = response.is_online;
                if (memberIsOnline) membersOnline.push(member);
            }));
            setDisabled(membersOnline.length < 3)
        }
        
        checkIsDisabled()
    
    }, [])

  const handleClickChatWithGroup = (param) => () =>{
      if(isDisabled) return
      defineGroup(param)

      setTimeout(() => {
          const recovedGroupData = recoverGroup()
          updateGroupData({ type: 'updateAll', 
          payload: recovedGroupData})
          navigate("/group_chat")
        }, 200);
  }
  
  return (
    <StyledButton key={index} onClick={handleClickChatWithGroup(group)}>
      <span>{group.name}</span>
    </StyledButton>
  );
};

export default ButtonGroup;
