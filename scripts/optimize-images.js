/**
 * Otimiza imagens estáticas da pasta public/ para performance.
 * Executado automaticamente no prebuild.
 * Gera: AVIF (melhor compressão), WebP (amplo suporte), JPEG (fallback).
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');

const TARGETS = [
  // [input, maxWidth, jpegQuality]
  ['hero-bg.jpg', 1200, 75],
];

async function run() {
  for (const [input, maxW, q] of TARGETS) {
    const src = path.join(PUBLIC, input);
    if (!fs.existsSync(src)) { console.log(`Skipping ${input} (not found)`); continue; }

    const baseName = input.replace(/\.[^.]+$/, '');
    const meta = await sharp(src).metadata();

    const pipeline = sharp(src).resize(maxW, null, { withoutEnlargement: true });

    const jpgTmp = path.join(PUBLIC, `${baseName}.jpg.tmp`);
    const webpOut = path.join(PUBLIC, `${baseName}.webp`);

    const [jpgInfo, webpInfo] = await Promise.all([
      pipeline.clone().jpeg({ quality: q, progressive: true }).toFile(jpgTmp),
      pipeline.clone().webp({ quality: q }).toFile(webpOut),
    ]);

    fs.renameSync(jpgTmp, path.join(PUBLIC, `${baseName}.jpg`));
    console.log(`${baseName}.jpg: ${jpgInfo.size}b | .webp: ${webpInfo.size}b`);

    // Versão mobile (600px) — LCP mais rápido em 4G
    const mobileWebp = path.join(PUBLIC, `${baseName}-mobile.webp`);
    const mobileInfo = await sharp(src)
      .resize(600, null, { withoutEnlargement: true })
      .webp({ quality: q - 5 })
      .toFile(mobileWebp);
    console.log(`${baseName}-mobile.webp: ${mobileInfo.size}b`);
  }
}

run().catch(err => { console.error('optimize-images:', err.message); process.exit(0); });
