import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import {
  HANDBOOK_MANIFEST_PATH,
  HANDBOOK_OUTPUT_DIR,
  docsPathForHandbookSlug,
  generatedHandbookManifest,
  readHandbookSourceTree,
  renderHandbookChapter,
  renderHandbookIndex,
} from './handbook-utils.mjs';

const sourceTree = readHandbookSourceTree();
const outputDir = resolve(process.cwd(), HANDBOOK_OUTPUT_DIR);

assertInsideWorkspace(outputDir);
mkdirSync(outputDir, { recursive: true });
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

writeGeneratedFile(docsPathForHandbookSlug('index'), renderHandbookIndex(sourceTree));

sourceTree.chapters.forEach((chapter) => {
  writeGeneratedFile(docsPathForHandbookSlug(chapter.slug), renderHandbookChapter(sourceTree, chapter));
});

writeGeneratedFile(
  HANDBOOK_MANIFEST_PATH,
  `${JSON.stringify(generatedHandbookManifest(sourceTree), null, 2)}\n`,
);

console.log(
  `Generated ${sourceTree.chapters.length + 1} handbook pages from ${sourceTree.source} with hash ${sourceTree.hash}`,
);

function writeGeneratedFile(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

function assertInsideWorkspace(path) {
  const workspace = resolve(process.cwd());
  const relativePath = relative(workspace, resolve(path));
  if (relativePath.startsWith('..') || relativePath === '') {
    throw new Error(`Refusing to write generated handbook output outside the workspace: ${path}`);
  }
}
