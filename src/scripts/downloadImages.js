// scripts/downloadAllParksImages.js
import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';

const API_KEY = 'g95NqAreaGWHTYsmGTS8XvfqvepxugbN7pg3t8PI';
const BASE_URL = `https://developer.nps.gov/api/v1/parks?limit=500&fields=images&api_key=${API_KEY}`;

function toSafeFileName(name) {
  return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}

async function downloadAllParkImages() {
  console.log('📡 Fetching all parks...');
  const res = await fetch(BASE_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Node.js Script)',
      'Accept': 'application/json',
    }
  });

  if (!res.ok) {
    const html = await res.text();
    throw new Error(`❌ API Error ${res.status}: ${html.slice(0, 200)}`);
  }

  const json = await res.json();
  const parks = json.data;
  const imageDir = path.resolve('public/images');
  await fs.ensureDir(imageDir);

  const imgMap = {};

  for (const park of parks) {
    const imageUrl = park.images?.[0]?.url;
    const safeName = toSafeFileName(park.fullName || park.name || park.parkCode || 'unknown');
    const filePath = path.join(imageDir, `${safeName}.jpg`);

    if (!imageUrl) {
      console.log(`⚠️ No image for ${park.fullName}`);
      continue;
    }

    try {
      if (await fs.pathExists(filePath)) {
        console.log(`🟡 Already exists: ${filePath}`);
        imgMap[park.fullName] = `${safeName}.jpg`;
        continue;
      }

      const imgRes = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Node.js Script)'
        }
      });

      if (!imgRes.ok) {
        console.warn(`❌ Failed to fetch image (${imgRes.status}): ${imageUrl}`);
        continue;
      }

      const buffer = await imgRes.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));
      imgMap[park.fullName] = `${safeName}.jpg`;
      console.log(`✅ Saved: ${park.fullName} → ${safeName}.jpg`);
    } catch (err) {
      console.error(`❌ Error saving image for ${park.fullName}:`, err.message);
    }
  }

  await fs.writeJson('parkImageMap.json', imgMap, { spaces: 2 });
  console.log('📦 parkImageMap.json created!');
  console.log('✅ All done!');
}

downloadAllParkImages();
