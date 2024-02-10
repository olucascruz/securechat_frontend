import React from 'react';
import styled from 'styled-components';

// Definindo o componente de input de senha estilizado
const StyledPasswordInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  background-color: #fff;
  width: 70%;
  color: black;
  height: 35px;
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: dodgerblue;
    box-shadow: 0 0 5px rgba(0, 0, 255, 0.5);
  }
`;

// Definindo a função PasswordInput que recebe os parâmetros e retorna o input de senha estilizado
export function InputPassword({ name, id, placeholder }) {
  return (
    <>
      <StyledPasswordInput required type="password" name={name} id={id} placeholder={placeholder} />
    </>
  );
}