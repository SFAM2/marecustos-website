import { cp, mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
await mkdir(resolve(root, 'public'), { recursive: true });
await cp(resolve(root, 'assets'), resolve(root, 'public/assets'), { recursive: true });
for (const file of ['styles.css', 'script.js', 'payloads-data.js', 'industries-data.js']) {
  await copyFile(resolve(root, file), resolve(root, 'public', file));
}
