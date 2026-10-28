import { cp, mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
await mkdir(resolve(root, 'public'), { recursive: true });
await cp(resolve(root, 'assets'), resolve(root, 'public/assets'), { recursive: true });
for (const file of ['styles.css', 'script.js', 'payloads-data.js', 'industries-data.js']) {
  await copyFile(resolve(root, file), resolve(root, 'public', file));
}
const logo = await readFile(resolve(root, 'assets/mare-custos-logo-mark.svg'), 'utf8');
await writeFile(resolve(root, 'public/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#060d19"/><g transform="translate(5 5)">${logo}</g></svg>`);
