import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetDir = path.join(root, 'public/stickers/sekai');
const regions = [
  { id: 'jp', name: '日本語', master: 'sekai-master-db-diff', assets: 'sekai-jp-assets' },
];

async function request(url) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (response.ok || response.status === 404) return response;
      throw new Error(`${response.status}: ${url}`);
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  throw new Error(`Unable to fetch ${url}`);
}

function dimensions(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return {
      w: bytes.readUInt32BE(16),
      h: bytes.readUInt32BE(20),
      mimetype: 'image/png',
      ext: 'png',
    };
  }
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('The downloaded file is not a PNG or WebP image');
  }
  for (let offset = 12; offset + 8 < bytes.length; ) {
    const type = bytes.toString('ascii', offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const p = offset + 8;
    let w;
    let h;
    if (type === 'VP8X') {
      w = bytes.readUIntLE(p + 4, 3) + 1;
      h = bytes.readUIntLE(p + 7, 3) + 1;
    } else if (type === 'VP8 ') {
      w = bytes.readUInt16LE(p + 6) & 0x3fff;
      h = bytes.readUInt16LE(p + 8) & 0x3fff;
    } else if (type === 'VP8L') {
      const bits = bytes.readUInt32LE(p + 1);
      w = (bits & 0x3fff) + 1;
      h = ((bits >>> 14) & 0x3fff) + 1;
    }
    if (w && h) return { w, h, mimetype: 'image/webp', ext: 'webp' };
    offset += 8 + size + (size % 2);
  }
  throw new Error('No image dimensions found');
}

await fs.mkdir(assetDir, { recursive: true });
const cachePath = path.join(assetDir, '.download-cache.json');
let cache = {};
try {
  cache = JSON.parse(await fs.readFile(cachePath, 'utf8'));
} catch {
  /* First sync. */
}
const catalog = {
  source: 'https://sekai.best/stamp',
  downloadedAt: new Date().toISOString(),
  regions: [],
};
const missing = [];
let completed = 0;
let total = 0;
const jobs = [];
for (const region of regions) {
  const base = `https://sekai-world.github.io/${region.master}`;
  const [stamps, characters] = await Promise.all(
    ['stamps', 'gameCharacters'].map(async (name) => (await request(`${base}/${name}.json`)).json())
  );
  const entry = {
    id: region.id,
    name: region.name,
    listed: stamps.length,
    characters,
    stickers: [],
  };
  catalog.regions.push(entry);
  total += stamps.length;
  for (const stamp of stamps) {
    if (!/^[a-zA-Z0-9_-]+$/.test(stamp.assetbundleName))
      throw new Error('Invalid stamp asset name');
    jobs.push(async () => {
      const prefix = `https://storage.sekai.best/${region.assets}/stamp/${stamp.assetbundleName}/${stamp.assetbundleName}`;
      let image = cache[prefix];
      if (!image || !(await fs.stat(path.join(assetDir, image.file)).catch(() => false))) {
        let response = await request(`${prefix}.png`);
        if (response.status === 404) response = await request(`${prefix}.webp`);
        if (response.status === 404) {
          missing.push({ region: region.id, id: stamp.id, name: stamp.name, url: `${prefix}.png` });
          completed += 1;
          return;
        }
        const bytes = Buffer.from(await response.arrayBuffer());
        const info = dimensions(bytes);
        const hash = createHash('sha256').update(bytes).digest('hex');
        image = {
          file: `${hash}.${info.ext}`,
          w: info.w,
          h: info.h,
          size: bytes.length,
          mimetype: info.mimetype,
        };
        await fs.writeFile(path.join(assetDir, image.file), bytes);
        cache[prefix] = image;
      }
      entry.stickers.push({
        id: stamp.id,
        asset: stamp.assetbundleName,
        name: stamp.name,
        characterId: stamp.characterId1 || 0,
        characterId2: stamp.characterId2 || 0,
        ...image,
      });
      completed += 1;
      if (completed % 200 === 0) {
        console.log(`${completed}/${total} stickers checked; ${missing.length} unavailable`);
        await fs.writeFile(cachePath, JSON.stringify(cache));
      }
    });
  }
}
console.log(
  `Downloading ${total} stickers across ${regions.length} regions (6 concurrent requests).`
);
let next = 0;
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (next < jobs.length) {
      const job = jobs[next];
      next += 1;
      await job();
    }
  })
);
for (const region of catalog.regions) region.stickers.sort((a, b) => a.id - b.id);
await fs.writeFile(cachePath, JSON.stringify(cache));
await fs.writeFile(
  path.join(root, 'src/nightcord/sekai-stickers.json'),
  `${JSON.stringify(catalog, null, 2)}\n`
);
await fs.writeFile(
  path.join(assetDir, 'unavailable.json'),
  `${JSON.stringify(missing, null, 2)}\n`
);
const downloaded = catalog.regions.reduce((count, region) => count + region.stickers.length, 0);
const unique = new Set(
  catalog.regions.flatMap((region) => region.stickers.map((image) => image.file))
);
console.log(
  JSON.stringify(
    {
      listed: total,
      downloaded,
      uniqueImages: unique.size,
      unavailable: missing.length,
      regions: catalog.regions.map(({ id, stickers }) => ({ id, count: stickers.length })),
    },
    null,
    2
  )
);
