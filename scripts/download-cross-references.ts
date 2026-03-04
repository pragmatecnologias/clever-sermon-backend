import { createWriteStream, promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import { spawnSync } from 'child_process';
import * as https from 'https';

const outputPath = process.argv[2] || 'data/openbible-cross-references.txt';
const txtUrl = 'https://a.openbible.info/data/cross-references.txt';
const zipUrl = 'https://a.openbible.info/data/cross-references.zip';

const download = (url: string, destination: string): Promise<number> =>
  new Promise((resolveDownload, reject) => {
    const request = https.get(
      url,
      { headers: { 'User-Agent': 'clever-sermon-datasets/1.0' } },
      (response) => {
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          response.destroy();
          download(response.headers.location, destination).then(resolveDownload).catch(reject);
          return;
        }
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`Download failed with status ${response.statusCode}`));
          return;
        }
        const stream = createWriteStream(destination);
        response.pipe(stream);
        stream.on('finish', () => stream.close(() => resolveDownload(response.statusCode || 200)));
      },
    );
    request.on('error', reject);
  });

const ensureDir = async (path: string) => {
  await fs.mkdir(dirname(path), { recursive: true });
};

const normalizeCrossReferences = (content: string) => {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.toLowerCase().startsWith('from verse'));

  const normalized: string[] = [];
  for (const line of lines) {
    const parts = line.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      normalized.push(`${parts[0]} ${parts[1]}`);
    }
  }
  return normalized.join('\n');
};

const extractFromZip = (zipPath: string, destination: string) => {
  const result = spawnSync('unzip', ['-p', zipPath, 'cross_references.txt'], { encoding: 'utf-8' });
  if (!result.stdout) {
    throw new Error('Failed to extract zip. Ensure `unzip` is installed or download the txt directly.');
  }
  const normalized = normalizeCrossReferences(result.stdout);
  fs.writeFile(destination, `${normalized}\n`);
};

(async () => {
  const resolvedOutput = resolve(outputPath);
  await ensureDir(resolvedOutput);

  try {
    const tempPath = `${resolvedOutput}.tmp`;
    await download(txtUrl, tempPath);
    const content = await fs.readFile(tempPath, 'utf-8');
    if (content.toLowerCase().includes('<html')) {
      throw new Error('Received HTML instead of text');
    }
    const normalized = normalizeCrossReferences(content);
    await fs.writeFile(resolvedOutput, `${normalized}\n`);
    await fs.unlink(tempPath);
    console.log(`Saved cross references to ${resolvedOutput}`);
    return;
  } catch {
    const zipPath = resolve(`${resolvedOutput}.zip`);
    await download(zipUrl, zipPath);
    extractFromZip(zipPath, resolvedOutput);
    await fs.unlink(zipPath);
    console.log(`Saved cross references to ${resolvedOutput}`);
  }
})();
