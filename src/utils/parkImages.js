export function getParkThumbnailFilename(name) {
  return `${name
    .replace(/’/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_')}_National_Park.jpg`;
}

export function getParkThumbnailPath(name) {
  return `${import.meta.env.BASE_URL}thumbnails/${getParkThumbnailFilename(name)}`;
}
