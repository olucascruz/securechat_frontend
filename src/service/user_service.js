import axios from "axios";

export const getUsers = async () =>{
    const usersEndpoint = 'http://127.0.0.1:5000/users';

    try {
        const response = await axios.get(usersEndpoint);
        // Retornando os dados da resposta
        return response.data;
    } catch (error) {
        // Lidando com erros
        console.error('Erro na requisição:', error);
        return []; // Retorna um array vazio em caso de erro, ou você pode lidar com o erro de outra forma
    }
}


export const registerUser = async (username, publicKey) =>{
    const data = {
        username: username,
        public_key: publicKey
    };

    const registerEndpoint = 'http://127.0.0.1:5000/register';
    axios.post(registerEndpoint, data)
  .then(response => {
    // Manipulando os dados da resposta
    console.log('Dados da resposta:', response.data);
  })
  .catch(error => {
    // Lidando com erros
    console.error('Erro na requisição:', error);
  });

}

