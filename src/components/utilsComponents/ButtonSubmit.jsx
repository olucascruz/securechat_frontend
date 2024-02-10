import React from 'react';
import styled from 'styled-components';

// Definindo o componente de botão de envio estilizado
const StyledSubmitButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4B2DFF;
  color: white;
  border: none;
  border-radius: 5px;
  width: 40%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: #1e90ff; /* Tom mais escuro ao passar o mouse */
  }

  &:focus {
    outline: none; /* Remove a borda padrão ao focar */
  }
`;

// Componente funcional que renderiza o botão de envio estilizado
export function ButtonSubmit({ children }){
  return (
    <StyledSubmitButton type="submit">
      {children}
    </StyledSubmitButton>
  );
};

