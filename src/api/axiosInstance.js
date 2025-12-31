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
// Produtos
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
