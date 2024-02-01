import axios from "axios";

export const getGroups = async () =>{
    const usersEndpoint = 'http://127.0.0.1:5000/get_group';

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


export const createGroups = async (name, members_id) =>{
    const data = {
        name: name,
        members_id: members_id,
    };

    const registerEndpoint = 'http://127.0.0.1:5000/create_group';
    axios.post(registerEndpoint, data)
    .then(response => {
    // Manipulando os dados da resposta
    console.log('Dados da resposta:', response.data);
        return response.status
    })
    .catch(error => {
    // Lidando com erros
    console.error('Erro na requisição:', error);
  });

}