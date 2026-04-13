/**
 * Gera a lista de URLs de produto para o react-snap pré-renderizar.
 *
 * Fluxo:
 *   1. Busca todos os produtos na API de produção
 *   2. Gera os slugs no mesmo formato que o frontend usa (slugifyProduct)
 *   3. Escreve a lista em scripts/product-urls.json
 *   4. O postbuild lê esse arquivo e passa as URLs ao react-snap via "include"
 *
 * Uso: node scripts/prerender-urls.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'https://api.meninadourada.shop').replace(/\/$/, '');
const OUTPUT = path.join(__dirname, 'product-urls.json');

// Espelho EXATO de src/seo/slugifyProduct.js — normalize antes de lowercase
function slugify(text) {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove unsafe chars
    .replace(/[\s_]+/g, '-')         // spaces/underscores → hyphen
    .replace(/-{2,}/g, '-')          // collapse repeated hyphens
    .replace(/^-+|-+$/g, '');        // trim leading/trailing hyphens
}

function getProductSlug(product) {
  // Usa exatamente a mesma lógica de src/seo/productUrl.js:
  // slug explícito da API tem prioridade, senão deriva só do nome (sem ID).
  if (product?.slug) return product.slug;
  return slugify(product?.nome || product?.name || '') || 'produto';
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    }).on('error', reject).on('timeout', () => reject(new Error('timeout')));
  });
}

async function getAllProducts() {
  const all = [];
  let page = 0;
  let more = true;

  while (more && page < 20) {
    const url = `${API_BASE}/produtos/all?page=${page}&size=20`;
    console.log(`  Buscando página ${page}... (${url})`);
    const resp = await fetchJson(url).catch(err => {
      console.warn(`  Aviso: falha na página ${page} — ${err.message}`);
      return null;
    });

    if (!resp) break;

    const items = Array.isArray(resp?.content) ? resp.content
      : Array.isArray(resp) ? resp
      : [];

    all.push(...items);

    const totalPages = resp?.totalPages ?? 1;
    if (page >= totalPages - 1 || items.length === 0) more = false;
    page++;
  }

  return all;
}

async function main() {
  console.log('Buscando produtos para pré-renderização...');

  const products = await getAllProducts();
  console.log(`${products.length} produtos encontrados.`);

  const urls = products
    .map(p => `/produto/${getProductSlug(p)}`)
    .filter(u => u !== '/produto/');

  fs.writeFileSync(OUTPUT, JSON.stringify(urls, null, 2), 'utf8');
  console.log(`URLs salvas em ${OUTPUT} (${urls.length} páginas de produto)`);

  // Salva também os dados completos dos produtos para o postbuild injetar no index.html
  // Isso elimina a dependência de timing do react-snap com chamadas de API assíncronas
  const DATA_OUTPUT = path.join(__dirname, 'product-data.json');
  fs.writeFileSync(DATA_OUTPUT, JSON.stringify(products, null, 2), 'utf8');
  console.log(`Dados de ${products.length} produtos salvos em product-data.json`);
}

main().catch(err => {
  console.error('Erro ao gerar URLs:', err.message);
  // Não falha o build — react-snap ainda pré-renderiza as páginas estáticas
  fs.writeFileSync(OUTPUT, '[]', 'utf8');
  process.exit(0);
});
