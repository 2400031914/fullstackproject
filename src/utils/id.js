let counter = Date.now()

export function generateId() {
  counter += 1
  return `id_${counter}_${Math.random().toString(36).slice(2, 9)}`
}
