// src/api/axiosInstance.js
import axios from "axios";

/** ===== Base URL ===== */
export const API_BASE_URL =
  (process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_BASE || "").trim() ||
  "https://api.meninadourada.shop";

/** ===== Axios Client ===== */
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { "Content-Type": "application/json" },
  // Opcional: só trate como sucesso 2xx
  validateStatus: (s) => s >= 200 && s < 300,
});

/** ===== Interceptors ===== */
// Bloqueia requisições para URLs HTTP inseguras (exceto localhost)
client.interceptors.request.use((config) => {
  const url = (config.baseURL || '') + (config.url || '');
  if (/^http:\/\/(?!localhost|127\.0\.0\.1)/i.test(url)) {
    return Promise.reject(new Error(`Requisição HTTP insegura bloqueada: ${url}`));
  }
  return config;
});

// Já retorna somente o payload
client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // Respeita cancelamento sem barulho
    if (err?.code === "ERR_CANCELED") {
      err.isCanceled = true;
      throw err;
    }
    // Anexa infos úteis e repassa o AxiosError original
    const res = err?.response;
    err.status = res?.status ?? 0;
    err.data = res?.data ?? null;
    err.url = err?.config?.url ?? "";
    throw err;
  }
);

/** ===== API ===== */
// Produtos — cache em memória para evitar re-fetch entre rotas
const _productCache = { data: null, timestamp: 0, ttl: 5 * 60 * 1000 }; // 5 min TTL

const _isProductCacheValid = () =>
  _productCache.data && (Date.now() - _productCache.timestamp < _productCache.ttl);

export const getCachedAllProducts = () => _productCache.data;

export const setCachedAllProducts = (products) => {
  if (Array.isArray(products) && products.length > 0) {
    _productCache.data = products;
    _productCache.timestamp = Date.now();
  }
};

export const getProducts = async (page = 0, size = 10, { signal } = {}) => {
  const data = await client.get("/produtos/all", { params: { page, size }, signal });

  // Backends que devolvem array direto
  if (Array.isArray(data)) {
    return {
      content: data,
      totalPages: 1,
      totalElements: data.length,
      size: data.length,
      number: 0,
    };
  }
  return data;
};

/**
 * Busca todos os produtos com cache em memória.
 * Se o cache estiver válido, retorna imediatamente sem requisição.
 * Usado pela página de detalhe para evitar re-fetch do catálogo inteiro.
 */
export const getAllProductsCached = async ({ signal } = {}) => {
  if (_isProductCacheValid()) return _productCache.data;

  const all = [];
  let page = 0;
  let more = true;
  while (more && page < 10) {
    const resp = await getProducts(page, 20, { signal });
    const items = Array.isArray(resp?.content) ? resp.content : Array.isArray(resp) ? resp : [];
    all.push(...items);
    const totalPages = resp?.totalPages ?? 1;
    if (page >= totalPages - 1 || items.length === 0) more = false;
    page++;
  }

  setCachedAllProducts(all);
  return all;
};

export const createProduct       = (product,        cfg) => client.post(`/produtos/insert`,          product,        cfg);
export const getProductById      = (id,             cfg) => client.get ( `/produtos/findById/${id}`, cfg);
export const updateProduct       = (id, body,       cfg) => client.put ( `/produtos/update/${id}`,   body,           cfg);
export const deleteProduct       = (id,             cfg) => client.delete(`/produtos/delete/${id}`,  cfg);
export const createProductsBatch = (products,       cfg) => client.post(`/produtos/batch-insert`,    products,       cfg);

// Pagamentos/Checkout
const ensurePlainBody = (payload) => {
  if (payload == null) return {};
  if (typeof payload === "string") {
    try {
      return JSON.parse(payload);
    } catch {
      return payload;
    }
  }
  if (typeof payload.body !== "undefined") {
    const nested = payload.body;
    if (typeof nested === "string") {
      try {
        return JSON.parse(nested);
      } catch {
        return nested;
      }
    }
    if (nested && typeof nested === "object") {
      return nested;
    }
  }
  return payload;
};

export const createPaymentOrder = (payload, cfg) =>
  client.post(`/payments/orders`, ensurePlainBody(payload), cfg);

const ASAAS_BASE_URL =
  (process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_ASAAS_BASE_URL_PROD
    : process.env.REACT_APP_ASAAS_BASE_URL_SANDBOX
  )?.trim() || "";
const ASAAS_PIX_BASE_URL = ASAAS_BASE_URL
  ? `${ASAAS_BASE_URL.replace(/\/$/, "")}/v3`
  : "";

export const getAsaasPixQrCode = (paymentId, cfg) =>
  axios.get(`${ASAAS_PIX_BASE_URL}/payments/${paymentId}/pixQrCode`, cfg);



// Newsletter
export const subscribeToNewsletter = (email, cfg) =>
  client.post("/newsletter/subscribe", { email }, cfg);

export default client;
