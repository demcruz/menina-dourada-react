import axios from 'axios';

// Use a variável de ambiente para a URL base da API.
// Isso garante que a URL mude automaticamente entre desenvolvimento (localhost) e produção (servidor).
// Se você usa Vite: import.meta.env.VITE_API_BASE_URL
// Se você usa Create React App: process.env.REACT_APP_API_BASE_URL
// Certifique-se de que no seu arquivo .env você tem:
// VITE_API_BASE_URL=http://18.228.9.73:9090/api
// OU
const API_BASE_URL_ENV= 'http://18.228.9.73:9090/api'
//const  = import.meta.env.VITE_API_BASE_URL;
console.log(import.meta.env)

// Crie uma instância do Axios com a URL base configurada.
// Isso evita repetir a URL em cada requisição e permite configurar cabeçalhos padrão, timeouts, etc.
const axiosInstance = axios.create({
  baseURL: API_BASE_URL_ENV, // A URL base será 'http://18.228.9.73:9090/api'
  timeout: 10000, // Tempo limite de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    // Adicione outros cabeçalhos padrão aqui, como Authorization, se necessário
  },
});

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
