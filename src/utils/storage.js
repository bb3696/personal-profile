export function readStorageItem(key, fallback = null) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStorageItem(key, value) {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(key) {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function readJsonStorage(key, fallback) {
  const rawValue = readStorageItem(key);

  if (rawValue == null) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
}

export function writeJsonStorage(key, value) {
  return writeStorageItem(key, JSON.stringify(value));
}
