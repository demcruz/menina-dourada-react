/**
 * Orquestra o pós-build:
 *   1. Busca URLs de produto na API de produção
 *   2. Injeta __PRELOADED_PRODUCTS__ no index.html para o react-snap capturar com dados reais
 *   3. Injeta essas URLs no react-snap via "include" dinâmico
 *   4. Executa o react-snap
 *   5. Remove o __PRELOADED_PRODUCTS__ do index.html final (não expor catálogo inteiro em produção)
 *
 * Uso: node scripts/postbuild.js  (chamado pelo npm postbuild)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const URLS_FILE = path.join(__dirname, 'product-urls.json');
const PKG_PATH  = path.join(__dirname, '..', 'package.json');
const INDEX_HTML = path.join(__dirname, '..', 'build', 'index.html');

// Páginas estáticas sempre pré-renderizadas
const STATIC_URLS = [
  '/',
  '/produtos',
  '/sobre',
  '/contato',
  '/politica-de-frete',
  '/trocas-e-devolucoes',
  '/privacidade',
  '/termos',
];

const PRELOAD_MARKER = '<!-- __PRELOADED_PRODUCTS_INJECT__ -->';

async function main() {
  // 1. Gera URLs de produto e busca os dados
  console.log('\n[postbuild] Gerando URLs de produto...');
  try {
    execSync('node scripts/prerender-urls.js', { stdio: 'inherit' });
  } catch {
    console.warn('[postbuild] Aviso: falha ao buscar URLs de produto. Continuando apenas com páginas estáticas.');
    fs.writeFileSync(URLS_FILE, '[]', 'utf8');
  }

  // 2. Lê URLs e produtos gerados
  let productUrls = [];
  let products = [];
  try {
    productUrls = JSON.parse(fs.readFileSync(URLS_FILE, 'utf8'));
  } catch { productUrls = []; }

  // Lê os dados dos produtos (prerender-urls.js salva junto)
  const PRODUCTS_FILE = path.join(__dirname, 'product-data.json');
  try {
    products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  } catch { products = []; }

  const allUrls = [...STATIC_URLS, ...productUrls];
  console.log(`\n[postbuild] Pré-renderizando ${allUrls.length} URLs (${productUrls.length} produtos + ${STATIC_URLS.length} estáticas)`);

  // 3. Injeta __PRELOADED_PRODUCTS__ no index.html do build
  // O react-snap vai executar o JS com esses dados já disponíveis → sem chamada de API → sem timing issue
  if (products.length > 0 && fs.existsSync(INDEX_HTML)) {
    const originalHtml = fs.readFileSync(INDEX_HTML, 'utf8');
    const preloadScript = `<script>window.__PRELOADED_PRODUCTS__=${JSON.stringify(products)};</script>${PRELOAD_MARKER}`;
    const injectedHtml = originalHtml.replace('</head>', `${preloadScript}\n</head>`);
    fs.writeFileSync(INDEX_HTML, injectedHtml, 'utf8');
    console.log(`[postbuild] ${products.length} produtos injetados no index.html para prerender.`);
  }

  // 4. Atualiza temporariamente o "include" no package.json para o react-snap
  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
  const originalInclude = pkg.reactSnap?.include;
  pkg.reactSnap = { ...pkg.reactSnap, include: allUrls };
  fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2), 'utf8');

  // 5. Executa PurgeCSS para remover CSS não utilizado (antes do react-snap)
  console.log('\n[postbuild] Executando PurgeCSS...');
  try {
    execSync('node scripts/purge-css.js', { stdio: 'inherit' });
  } catch {
    console.warn('[postbuild] Aviso: PurgeCSS falhou. Continuando sem purge.');
  }

  // 6. Executa react-snap — falha o build se o snap falhar criticamente
  try {
    execSync('npx react-snap', { stdio: 'inherit' });
  } catch (err) {
    pkg.reactSnap = { ...pkg.reactSnap, include: originalInclude };
    fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2), 'utf8');
    try { fs.unlinkSync(URLS_FILE); } catch { /* ok */ }
    try { fs.unlinkSync(PRODUCTS_FILE); } catch { /* ok */ }
    console.error('[postbuild] ERRO: react-snap falhou. Verifique se a API está acessível durante o build.');
    console.error(err.message);
    process.exit(1);
  }

  // 7. Remove o __PRELOADED_PRODUCTS__ do index.html raiz (não expor catálogo em produção)
  // As páginas de produto pré-renderizadas já têm o HTML estático — não precisam mais do script.
  // Usa regex sem depender do marker (que pode ser removido pelo minificador do react-snap).
  if (fs.existsSync(INDEX_HTML)) {
    let finalHtml = fs.readFileSync(INDEX_HTML, 'utf8');
    finalHtml = finalHtml.replace(/<script>window\.__PRELOADED_PRODUCTS__=\[[\s\S]*?\];<\/script>/g, '');
    fs.writeFileSync(INDEX_HTML, finalHtml, 'utf8');
    console.log('[postbuild] __PRELOADED_PRODUCTS__ removido do index.html raiz.');
  }

  // 8. Restaura o package.json original
  pkg.reactSnap = { ...pkg.reactSnap, include: originalInclude };
  fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2), 'utf8');

  // 9. Limpa arquivos temporários
  try { fs.unlinkSync(URLS_FILE); } catch { /* ok */ }
  try { fs.unlinkSync(path.join(__dirname, 'product-data.json')); } catch { /* ok */ }

  console.log('\n[postbuild] Pré-renderização concluída.');
}

main();
