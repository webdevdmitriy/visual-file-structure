import { useEffect, useState } from 'react'
import { FileExplorer } from './components/FileExplorer.jsx'
import { fetchFileSystem } from './api/fileSystem.js'
import { getFolderByPath, getPathFromUrl, getPathParents, navigateToPath, pathToKey } from './utils/tree.js'

export function App() {
  const [tree, setTree] = useState(null)
  const [currentPath, setCurrentPath] = useState(getPathFromUrl)
  const [expandedFolders, setExpandedFolders] = useState(getInitialExpandedFolders)
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    fetchFileSystem()
      .then(data => {
        setTree(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getPathFromUrl())

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const rootFolder = tree ? getFolderByPath(tree, []) : null
  const currentFolder = tree ? getFolderByPath(tree, currentPath) : null

  useEffect(() => {
    setExpandedFolders(folders => addExpandedPath(folders, currentPath))
  }, [currentPath])

  const openFolder = path => {
    const pathKey = pathToKey(path)
    const isCurrentFolder = pathKey === pathToKey(currentPath)
    const isExpanded = expandedFolders.has(pathKey)

    if (isCurrentFolder && isExpanded) {
      setExpandedFolders(folders => {
        const nextFolders = new Set(folders)
        nextFolders.delete(pathKey)

        return nextFolders
      })
      return
    }

    navigateToPath(path)
    setCurrentPath(path)
    setExpandedFolders(folders => addExpandedPath(folders, path))
  }

  const goHome = () => openFolder([])

  if (status === 'loading') {
    return <main className="app app_centered">Загрузка...</main>
  }

  if (status === 'error') {
    return (
      <main className="app app_centered">
        Не удалось загрузить структуру файлов. Проверьте, что сервер запущен на http://localhost:3001.
      </main>
    )
  }

  if (!currentFolder) {
    return (
      <main className="app app_centered">
        <p>Папка не найдена.</p>
        <button className="text-button" onClick={goHome}>
          Вернуться в корень
        </button>
      </main>
    )
  }

  return (
    <main className="app">
      <section className="explorer">
        <div className="search">
          <input
            className="search__input"
            type="search"
            value={searchQuery}
            placeholder="Поиск файлов и папок"
            onChange={event => setSearchQuery(event.target.value)}
          />
        </div>

        <FileExplorer
          folder={rootFolder}
          selectedPath={currentPath}
          expandedFolders={expandedFolders}
          searchQuery={searchQuery}
          onOpenFolder={openFolder}
        />
      </section>
    </main>
  )
}

function getInitialExpandedFolders() {
  return new Set(getPathParents(getPathFromUrl()).map(pathToKey))
}

function addExpandedPath(folders, path) {
  const nextFolders = new Set(folders)

  getPathParents(path).forEach(parentPath => {
    nextFolders.add(pathToKey(parentPath))
  })

  return nextFolders
}
