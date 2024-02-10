import React from 'react';
import styled from 'styled-components';

// Container para o item da lista
const ListItemContainer = styled.li`
  justify-content: center;
  text-align: center;
  display: flex; /* Usando flexbox para alinhar os itens na horizontal */
  align-items: center; /* Alinhando os itens verticalmente */
  margin-bottom: 10px; /* Adicionando um espaçamento inferior entre os itens
  
*/
`;

// Definindo o componente de botão de início de chat estilizado
const StyledChatButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: dodgerblue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e90ff;
  }

  &:focus {
    outline: none;
  }
`;

// Componente funcional que renderiza um item da lista de usuários com um botão de início de chat
export function UserListItem({ user, onClick }){
  return (
    <ListItemContainer>
      <span>{user.username}: {user.is_online ? 'Online' : 'Offline'}</span>
      <StyledChatButton onClick={() => onClick(user)}>
        Start Chat
      </StyledChatButton>
    </ListItemContainer>
  );
};

