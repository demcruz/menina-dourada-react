import axios from 'axios';

//HML
const API_BASE_URL_ENV = '/api';

//LOCAL
//const API_BASE_URL_ENV = 'http://18.228.9.73:9090/api/'


console.log(import.meta.env)


const axiosInstance = axios.create({
  baseURL: API_BASE_URL_ENV, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createPaymentPreference = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payments/create-preference', paymentData);
    return response.data; // Retorna a resposta da preferência (PreferenceResponseDTO)
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error.response?.data || error.message);
    throw error;
  }
};


// Função para buscar todos os produtos com paginação
export const getProducts = async (page = 0, size = 10) => {
  try {
    // Usando axiosInstance, o caminho relativo é '/produtos/all'
    const response = await axiosInstance.get('/produtos/all', {
      params: { page, size } // Passa os parâmetros de paginação como query params
    });
    return response.data; // Axios retorna a resposta no campo 'data'
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para inscrever um e-mail na newsletter
export const subscribeToNewsletter = async (email) => {
  try {
    const response = await axiosInstance.post('/newsletter/subscribe', { email });
    return response.data; // Retorna a resposta da API (ex: { message: "E-mail inscrito com sucesso!" })
  } catch (error) {
    console.error('Erro ao inscrever e-mail na newsletter:', error.response?.data || error.message);
    throw error; // Propaga o erro para ser tratado pelo componente que chamou
  }
};

// Função para criar um novo produto
export const createProduct = async (productData) => {
  try {
    // Usando axiosInstance, o caminho relativo é '/produtos/insert'
    const response = await axiosInstance.post('/produtos/insert', productData);
    return response.data; // Retorna o produto criado
  } catch (error) {
    console.error('Erro ao criar produto:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para buscar um produto por ID
export const getProductById = async (productId) => {
  try {
    // Usando axiosInstance, o caminho relativo é '/produtos/findById/{productId}'
    const response = await axiosInstance.get(`/produtos/findById/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${productId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para atualizar um produto existente
export const updateProduct = async (productId, updatedProductData) => {
  try {
    // Usando axiosInstance, o caminho relativo é '/produtos/update/{productId}'
    const response = await axiosInstance.put(`/produtos/update/${productId}`, updatedProductData);
    return response.data; // Retorna o produto atualizado
  } catch (error) {
    console.error(`Erro ao atualizar produto com ID ${productId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para deletar um produto
export const deleteProduct = async (productId) => {
  try {
    // Usando axiosInstance, o caminho relativo é '/produtos/delete/{productId}'
    await axiosInstance.delete(`/produtos/delete/${productId}`);
    return true; // Retorna true em caso de sucesso (204 No Content)
  } catch (error) {
    console.error(`Erro ao deletar produto com ID ${productId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// NOTA: O endpoint 'batch-insert' não será usado diretamente no CRUD do dashboard por enquanto, mas está disponível.
// Se precisar de uma função para ele:
export const createProductsBatch = async (productsData) => {
  try {
    const response = await axiosInstance.post('/produtos/batch-insert', productsData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar produtos em lote:', error.response ? error.response.data : error.message);
    throw error;
  }
};
