const API_URL = 'http://localhost:3001/fs.json'

export async function fetchFileSystem() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Failed to load fs.json')
  }

  return response.json()
}
