import React from 'react';
import styled from 'styled-components';
// Definindo o componente de botão estilizado
const StyledButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4B2DFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e9f4ff; /* Tom mais escuro ao passar o mouse */
  }

  &:focus {
    outline: none; /* Remove a borda padrão ao focar */
  }
`;

// Componente funcional que renderiza o botão estilizado
const ButtonBase = ({ onClick, children }) => {
  return (
    <StyledButton onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default ButtonBase;
