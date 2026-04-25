// Validates pre-rendered build: lists titles, checks duplicates, verifies canonicals
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const PRODUCT_DIR = path.join(BUILD_DIR, 'produto');

function extractTitle(html) {
  const m = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return m ? m[1].trim() : null;
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
  return m ? m[1] : null;
}

function main() {
  console.log('=== BUILD VALIDATION ===\n');

  const staticPages = ['sobre', 'contato', 'privacidade', 'termos', 'politica-de-frete', 'trocas-e-devolucoes', 'produtos'];
  console.log('-- Static Pages --');
  for (const page of staticPages) {
    const file = path.join(BUILD_DIR, page, 'index.html');
    if (!fs.existsSync(file)) {
      console.log('  MISSING /' + page);
      continue;
    }
    const html = fs.readFileSync(file, 'utf8');
    const title = extractTitle(html);
    console.log('  OK /' + page + ' -> ' + (title ? title.slice(0, 60) : 'NO TITLE'));
  }

  console.log('\n-- Product Pages --');
  if (!fs.existsSync(PRODUCT_DIR)) {
    console.log('  ERROR: build/produto/ not found!');
    return;
  }

  const slugDirs = fs.readdirSync(PRODUCT_DIR).filter(function(d) {
    return fs.statSync(path.join(PRODUCT_DIR, d)).isDirectory();
  });

  const titles = [];

  for (const slug of slugDirs.sort()) {
    const file = path.join(PRODUCT_DIR, slug, 'index.html');
    if (!fs.existsSync(file)) {
      console.log('  MISSING /produto/' + slug);
      continue;
    }
    const html = fs.readFileSync(file, 'utf8');
    const title = extractTitle(html);
    const canonical = extractCanonical(html);
    const hasContent = html.includes('pdp-') || html.includes('COMPRAR');
    const expected = 'https://meninadourada.shop/produto/' + slug;

    titles.push({ slug: slug, title: title });

    var status = hasContent ? 'OK' : 'WARN:NO-CONTENT';
    var canonicalNote = (canonical === expected) ? '' : ' CANONICAL-MISMATCH:' + canonical;
    console.log('  ' + status + ' /produto/' + slug);
    console.log('     Title: ' + (title ? title.slice(0, 55) : 'NO TITLE') + canonicalNote);
  }

  console.log('\n-- Duplicate Check --');
  var titleMap = {};
  var dupes = 0;
  for (var i = 0; i < titles.length; i++) {
    var t = titles[i];
    if (!t.title) continue;
    if (titleMap[t.title]) {
      console.log('  DUPLICATE: "' + t.title.slice(0, 50) + '"');
      console.log('     -> /produto/' + titleMap[t.title]);
      console.log('     -> /produto/' + t.slug);
      dupes++;
    } else {
      titleMap[t.title] = t.slug;
    }
  }
  if (dupes === 0) {
    console.log('  All ' + titles.length + ' titles are unique');
  }

  console.log('\n-- Summary --');
  console.log('  Static pages: ' + staticPages.length);
  console.log('  Product pages: ' + slugDirs.length);
  console.log('  Total: ' + (staticPages.length + slugDirs.length));
}

main();
