import React from 'react';
import styled from 'styled-components';

// Container para o formulário estilizado
const StyledFormContainer = styled.div`
  background-color:  ${props => props.colorStyle ? 'transparent' : 'rgba(255, 255, 255, 0.9)'};/* Cor de fundo meio transparente */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Sombra suave */
`;

// Formulário estilizado
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Componente funcional que renderiza o formulário estilizado
export function FormBase({ children, onSubmit, id, notColor = false}){

  return (
    <StyledFormContainer colorStyle={notColor} id={id}>
      <StyledForm onSubmit={onSubmit}>
        {children}  
      </StyledForm>
    </StyledFormContainer>
  );
};