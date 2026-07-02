import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { copyFile, readdir } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import {
  HANDBOOK_SOURCE_DIR,
  HANDBOOK_UPSTREAM_SOURCE_DIR,
  readHandbookSourceTree,
  sourceRelative,
} from './handbook-utils.mjs';

const sourceDir = HANDBOOK_UPSTREAM_SOURCE_DIR;
const outputDir = HANDBOOK_SOURCE_DIR;

assertDirectoryInsideWorkspace(outputDir);

const files = (await readdir(sourceDir)).filter((name) => /^[0-9]{2}-[a-z0-9-]+\.md$/.test(name)).sort();

if (files.length === 0) {
  throw new Error(`No handbook chapter parts found in ${sourceDir}.`);
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

for (const file of files) {
  await copyFile(resolve(sourceDir, file), resolve(outputDir, file));
}

const sourceTree = readHandbookSourceTree(outputDir);
writeFileSync(
  resolve(outputDir, 'manifest.json'),
  `${JSON.stringify(
    {
      sourceRepository: 'blacklight-foundation/ultraviolet',
      sourceDirectory: 'Docs/UltravioletHandbook.parts',
      hash: sourceTree.hash,
      chapters: sourceTree.chapters.map(({ body, content, ...chapter }) => chapter),
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(
  `Synced ${files.length} handbook chapters from ${sourceDir} to ${sourceRelative(outputDir)} with hash ${sourceTree.hash}`,
);

function assertDirectoryInsideWorkspace(path) {
  const workspace = resolve(process.cwd());
  const resolvedPath = resolve(path);
  const relativePath = relative(workspace, resolvedPath);
  if (relativePath.startsWith('..') || relativePath === '') {
    throw new Error(`Refusing to replace handbook source outside the workspace: ${resolvedPath}`);
  }
}
