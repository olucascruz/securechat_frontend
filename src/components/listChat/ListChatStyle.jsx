import styled from 'styled-components';
// Definindo o componente de div estilizado
export const ListChatStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  position: fixed;
  height: 100vh;
  right: 0;
  left: 0;
  margin: auto;
  color: black;
  border-radius: 5%;
  background-color: #A5DEFF; 

  .headerChat{
    display: flex;
    width: 100%;
    background-color: #0097C7;
    height: 7%;
  }

  .buttonLogout{
    margin-left: auto;
    right: 0;
    height: 60%;
    margin-right: 20px;
    margin-top: auto;
    margin-bottom: auto;

  }

  ul{
    display:flex; 
    justify-content:center;
    flex-direction:column;
    align-items: center;
    margin: 0;
    padding-top: 5px;
    padding-bottom: 5px;
    overflow-y: scroll;
  }
    /* Estilo para a barra de rolagem */
  ul::-webkit-scrollbar {
    width: 10px; /* Largura da barra de rolagem */
  }

  /* Cor de fundo da barra de rolagem */
  ul::-webkit-scrollbar-track {
    background-color: #f1f1f1; /* Cor de fundo */
  }

  /* Estilo do indicador da barra de rolagem */
  ul::-webkit-scrollbar-thumb {
    background-color: #0097C7; /* Cor do indicador */
    border-radius: 5px; /* Borda arredondada */
  }

  /* Estilo do indicador da barra de rolagem quando está passando o mouse */
  ul::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* Cor do indicador ao passar o mouse */
  }

  #users{
    max-height: 370px;
  }

  #groups{
    max-height: 165px;
  
  }


  .headerSectionGroups{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;

  }

  .buttonCreateGroup{
    display: flex;
    border-radius: 50%;
    height: 40px;
    width: 40px;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .buttonCreateGroup:hover{
    background-color: #d5e3ff;
  }

  .titleList{
   right:0;
   left: 0;
   margin: 0 auto;
   margin-top: 20px;
   margin-bottom: 20px;
   font-weight: bold;

  }
  
`;
