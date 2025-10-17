export const apiBase =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:4000'

export async function getJSON<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, init)
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`)
  }
  return res.json() as Promise<T>
}

export async function postJSON<T = any>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    body: JSON.stringify(body),
    ...init
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`)
  }
  return res.json() as Promise<T>
}
