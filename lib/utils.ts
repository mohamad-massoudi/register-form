export function createUniqueUsername() {
  return `username-${Math.random().toString(36).slice(2, 9)}`
}
