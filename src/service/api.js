import { PARK_NAMES } from '../data/parkList';
import imageMap from '../../parkImageMap.json'; // fullName → 文件名映射

const BASE_URL = 'https://developer.nps.gov/api/v1';
const API_KEY = 'g95NqAreaGWHTYsmGTS8XvfqvepxugbN7pg3t8PI';

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[\s’ʻ‘–—'-]+/g, '')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '');
}

export async function fetchParks(limit = 500) {
  const cached = localStorage.getItem("nationalParks");
  if (cached) return JSON.parse(cached);

  const url = `${BASE_URL}/parks?limit=${limit}&api_key=${API_KEY}&fields=images`;
  const response = await fetch(url);
  const json = await response.json();

  // ✅ 只保留 fullName 匹配到的 63 个国家公园
  const matchedParks = json.data.filter(park =>
    PARK_NAMES.some(name => normalizeName(name) === normalizeName(park.fullName))
  );

  // ✅ 注入本地图像路径
  matchedParks.forEach(park => {
    const filename = imageMap[park.fullName];
    park.localImage = filename ? `/images/${filename}` : null;
  });

  localStorage.setItem("nationalParks", JSON.stringify(matchedParks));
  return matchedParks;
}
