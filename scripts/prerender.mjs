import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const projectRoot = resolve(import.meta.dirname, '..');
const distRoot = resolve(projectRoot, 'dist');
const manifest = JSON.parse(await readFile(resolve(distRoot, '.vite/manifest.json'), 'utf8'));

function resolveBuiltAssets(markup) {
  let resolved = markup;
  for (const [source, output] of Object.entries(manifest)) {
    if (source.startsWith('src/assets/') && output.file) {
      resolved = resolved.replaceAll(`/${source}`, `/${output.file}`);
    }
  }
  return resolved;
}

async function injectMarkup(relativePath, markup) {
  const outputPath = resolve(distRoot, relativePath);
  const document = await readFile(outputPath, 'utf8');
  const placeholder = '<div id="root"></div>';
  if (!document.includes(placeholder)) {
    throw new Error(`Missing React root placeholder in ${relativePath}`);
  }
  await writeFile(outputPath, document.replace(placeholder, `<div id="root">${resolveBuiltAssets(markup)}</div>`));
}

const vite = await createServer({
  root: projectRoot,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true }
});

try {
  const { renderHome, renderArticle } = await vite.ssrLoadModule('/src/entry-server.jsx');
  await injectMarkup('index.html', renderHome());
  await injectMarkup('journal/index.html', renderArticle());
} finally {
  await vite.close();
}
