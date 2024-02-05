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


export const registerUser = async (username, password, publicKey) =>{
    const data = {
        username: username,
        password: password,
        public_key: publicKey
    };

    const registerEndpoint = 'http://127.0.0.1:5000/register';
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

export const loginUser = async (username, password, publicKey) =>{
  const data = {
      username: username,
      password: password,
      public_key: publicKey
  };

  const registerEndpoint = 'http://127.0.0.1:5000/login';
  try{
  const response = await axios.post(registerEndpoint, data)
  return response

  } catch(error){
    // Lidando com erros
    console.error('Erro na requisição:', error);
  };
  }

export const getPublicKey = async (user_id) =>{
  const getPublicKeyEndpoint = `http://127.0.0.1:5000/getPublicKey?user_id=${user_id}`;
  try {
    const response = await axios.get(getPublicKeyEndpoint);
    // Retornando os dados da resposta
    return response.data;
  } catch (error) {
      // Lidando com erros
      console.error('Erro na requisição:', error);
      return []; // Retorna um array vazio em caso de erro, ou você pode lidar com o erro de outra forma
  }
}

