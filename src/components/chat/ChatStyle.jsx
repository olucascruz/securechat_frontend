import styled from 'styled-components';
// Definindo o componente de div estilizado
export const ChatStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  position: fixed;
  height: 100vh;
  align-items: center;
  right: 0;
  left: 0;
  margin: auto;
  color: black;
  background-color: #0098c77f; 

  #msgs{
    max-height: 70%;
    width: 100%;
    height: auto;
    padding: 0;
    overflow-y: auto;
  }
  #formMsg{
    bottom: 0;
    position: absolute;
    display: flex;
    width: 60%;
    height: 60px;
    left: 0;
    right: 0;
    margin: auto;
    margin-bottom: 30px;
    margin-top: 50px;
  }

  #iMsg{
    width: 100%;
    font-size: 20px;
  }

  .headerChat{
    display: flex;
    width: 100%;
    height: 75px;
    background-color: #0098c7a2;
    }

    .arrowBack{
        cursor: pointer;
        height: 50px;
        width: 50px;
        margin-top: 10px;
        position: fixed;  
    }
    
    .arrowBack:hover{
        background-color: #3dd2ff7e;     
    }

    .logoChat{
        cursor: pointer;
        height: 50px;
        margin: 10px;
        margin-left: 60px;
        position: fixed;
    }

    .receiverName{
        left: 0;
        right: 0;
        margin: auto;
    }

`