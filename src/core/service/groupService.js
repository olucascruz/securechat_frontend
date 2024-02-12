import axios from "axios";

export const getGroups = async (user_id) =>{
    const usersEndpoint = 'http://127.0.0.1:5000/get_group';

    try {
        const data = {"id":user_id}
        const response = await axios.post(usersEndpoint, data);
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
    try{
    const response = await axios.post(registerEndpoint, data)
    return response.status
    }catch(error){
        // Lidando com erros
        console.error('Erro na requisição:', error);
    }
    return null
}