/**
 * Otimiza imagens estáticas da pasta public/ para performance.
 * Executado automaticamente no prebuild.
 * Não toca em imagens já otimizadas (verifica tamanho).
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');

const TARGETS = [
  // [input, output_jpg, output_webp, maxWidth, quality]
  ['hero-bg.jpg', 'hero-bg.jpg', 'hero-bg.webp', 1200, 75],
];

async function run() {
  for (const [input, outJpg, outWebp, maxW, q] of TARGETS) {
    const src = path.join(PUBLIC, input);
    if (!fs.existsSync(src)) { console.log(`Skipping ${input} (not found)`); continue; }

    const meta = await sharp(src).metadata();
    // Só reprocessa se a imagem for maior que o alvo
    if (meta.width <= maxW && meta.size < 150_000) {
      console.log(`${input} já otimizado (${meta.width}px, ${meta.size}b)`);
      continue;
    }

    const jpgOut = path.join(PUBLIC, outJpg + '.tmp');
    const webpOut = path.join(PUBLIC, outWebp);

    const [jpgInfo, webpInfo] = await Promise.all([
      sharp(src).resize(maxW, null, { withoutEnlargement: true })
        .jpeg({ quality: q, progressive: true }).toFile(jpgOut),
      sharp(src).resize(maxW, null, { withoutEnlargement: true })
        .webp({ quality: q }).toFile(webpOut),
    ]);

    fs.renameSync(jpgOut, path.join(PUBLIC, outJpg));
    console.log(`${outJpg}: ${jpgInfo.size}b | ${outWebp}: ${webpInfo.size}b`);
  }
}

run().catch(err => { console.error('optimize-images:', err.message); process.exit(0); });
