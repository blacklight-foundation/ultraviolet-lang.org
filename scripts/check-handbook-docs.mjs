import { existsSync, readFileSync } from 'node:fs';
import {
  HANDBOOK_MANIFEST_PATH,
  docsPathForHandbookSlug,
  generatedHandbookManifest,
  readHandbookSourceTree,
  renderHandbookChapter,
  renderHandbookIndex,
} from './handbook-utils.mjs';

const errors = [];
const sourceTree = readHandbookSourceTree();

checkManifest();
checkGeneratedPage(docsPathForHandbookSlug('index'), renderHandbookIndex(sourceTree));

sourceTree.chapters.forEach((chapter) => {
  checkGeneratedPage(docsPathForHandbookSlug(chapter.slug), renderHandbookChapter(sourceTree, chapter));
});

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Handbook docs are current: ${sourceTree.chapters.length + 1} pages, hash ${sourceTree.hash}`);

function checkManifest() {
  if (!existsSync(HANDBOOK_MANIFEST_PATH)) {
    errors.push(`Missing ${HANDBOOK_MANIFEST_PATH}. Run npm run docs:handbook:generate.`);
    return;
  }

  const manifest = JSON.parse(readFileSync(HANDBOOK_MANIFEST_PATH, 'utf8'));
  const expected = generatedHandbookManifest(sourceTree);
  if (JSON.stringify(manifest) !== JSON.stringify(expected)) {
    errors.push(`${HANDBOOK_MANIFEST_PATH} does not match the current handbook source tree.`);
  }
}

function checkGeneratedPage(path, expected) {
  if (!existsSync(path)) {
    errors.push(`Missing generated handbook page ${path}.`);
    return;
  }

  const content = readFileSync(path, 'utf8');
  if (content !== expected) {
    errors.push(`${path} does not match the current handbook source.`);
  }
  if (!content.includes(`handbookHash: "${sourceTree.hash}"`)) {
    errors.push(`${path} does not include current handbook hash.`);
  }
  checkFences(path, content);
}

function checkFences(path, content) {
  const lines = content.split(/\r?\n/);
  let inFence = false;
  let fenceStart = 0;
  let contentLines = 0;

  lines.forEach((line, index) => {
    const fence = line.match(/^```[A-Za-z0-9_-]*\s*$/);
    if (!fence) {
      if (inFence && line.trim() !== '') contentLines += 1;
      return;
    }

    if (!inFence) {
      inFence = true;
      fenceStart = index + 1;
      contentLines = 0;
      return;
    }

    if (contentLines === 0) {
      errors.push(`${path} has an empty fenced block starting at line ${fenceStart}.`);
    }
    inFence = false;
    fenceStart = 0;
    contentLines = 0;
  });

  if (inFence) {
    errors.push(`${path} has an unclosed fenced block starting at line ${fenceStart}.`);
  }
}
