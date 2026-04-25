/**
 * PurgeCSS postbuild — remove CSS não utilizado do bundle final.
 * Roda ANTES do react-snap para que o HTML pré-renderizado já tenha CSS limpo.
 *
 * Uso: node scripts/purge-css.js
 */
const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');

const BUILD_DIR = path.join(__dirname, '..', 'build');

async function run() {
  const staticDir = path.join(BUILD_DIR, 'static', 'css');
  if (!fs.existsSync(staticDir)) {
    console.log('[purge-css] Nenhum diretório CSS encontrado. Pulando.');
    return;
  }

  const cssFiles = fs.readdirSync(staticDir).filter(f => f.endsWith('.css'));
  if (cssFiles.length === 0) {
    console.log('[purge-css] Nenhum arquivo CSS encontrado. Pulando.');
    return;
  }

  for (const cssFile of cssFiles) {
    const cssPath = path.join(staticDir, cssFile);
    const originalSize = fs.statSync(cssPath).size;

    const results = await new PurgeCSS().purge({
      content: [
        path.join(BUILD_DIR, '**', '*.html'),
        path.join(BUILD_DIR, 'static', 'js', '*.js'),
      ],
      css: [cssPath],
      // Safelist: classes dinâmicas que podem não aparecer no HTML estático
      safelist: {
        standard: [
          /^modal-/,
          /^pdp-/,
          /^cart-/,
          /^checkout-/,
          /^lgpd-/,
          /^contact-/,
          /^toast/,
          /^newsletter-/,
          /^skeleton/,
          /^badge-/,
          /^sort-/,
          /^filter-/,
          /is-open/,
          /is-hidden/,
          /active/,
          /open/,
          /selected/,
          /zoomed/,
          /navbar-scrolled/,
          /trust-bar--hidden/,
          /fade-out/,
          /email-mode/,
        ],
        greedy: [/^fa-/, /^fas$/, /^fab$/, /^far$/],
      },
      // Não remover keyframes usados
      keyframes: true,
      // Não remover variáveis CSS
      variables: true,
    });

    if (results.length > 0 && results[0].css) {
      fs.writeFileSync(cssPath, results[0].css, 'utf8');
      const newSize = fs.statSync(cssPath).size;
      const saved = originalSize - newSize;
      const pct = ((saved / originalSize) * 100).toFixed(1);
      console.log(`[purge-css] ${cssFile}: ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (−${(saved / 1024).toFixed(1)}KB, ${pct}%)`);
    }
  }
}

run().catch(err => {
  console.warn('[purge-css] Aviso:', err.message);
  // Não falha o build — PurgeCSS é otimização, não requisito
  process.exit(0);
});
