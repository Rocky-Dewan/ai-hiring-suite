export function getEnv(name: string, required = true): string {
  const val = process.env[name]
  if (required && !val) throw new Error(`Missing required ENV var: ${name}`)
  return val || ''
}
