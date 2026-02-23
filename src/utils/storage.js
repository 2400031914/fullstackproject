const STORAGE_KEYS = {
  AUTH: 'lms_auth',
  LMS_DATA: 'lms_data',
}

export function getStorage(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export { STORAGE_KEYS }
