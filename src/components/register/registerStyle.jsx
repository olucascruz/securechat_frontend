import styled from 'styled-components';
// Definindo o componente de botão estilizado
export const RegisterStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  /* background-color: red; */
  border-radius: 5%;

  #formRegister{
        height: 100vh;
        position: fixed;
        right: 0;
        background-color: #a0e1ff;
        width: 25%;
    }

    .label{
        color:black;
        margin-right: auto;
        margin-left: 15%;
    }

    .linkLogin{
        font-size:20px;
        margin-top:20px;
    }

    .titleForm{
        color:black;
    }
`;
