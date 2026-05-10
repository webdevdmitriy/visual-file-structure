const PATH_PREFIX = '/path'

export function getPathFromUrl() {
  const pathname = window.location.pathname

  if (pathname !== PATH_PREFIX && !pathname.startsWith(`${PATH_PREFIX}/`)) {
    return []
  }

  // URL вида /path/movies/Avengers превращаем в массив:
  // ['movies', 'Avengers']
  return pathname.slice(PATH_PREFIX.length).split('/').filter(Boolean).map(decodeURIComponent)
}

export function navigateToPath(path) {
  const url = path.length ? `${PATH_PREFIX}/${path.map(encodeURIComponent).join('/')}` : '/'

  window.history.pushState(null, '', url)
}

export function getFolderByPath(tree, path) {
  const root = getRootFolder(tree)

  // Последовательно спускаемся по дереву по каждому сегменту пути
  // Если на каком-то шаге папка не найдена, возвращаем null
  return path.reduce((folder, segment) => {
    if (!isFolder(folder)) {
      return null
    }

    const nextNode = folder.children?.[segment]
    return isFolder(nextNode) ? nextNode : null
  }, root)
}

export function getFolderItems(folder) {
  return Object.entries(folder.children || {})
    .map(([name, node]) => ({ name, node }))
    .sort((left, right) => {
      const leftFolder = isFolder(left.node)
      const rightFolder = isFolder(right.node)

      // Сначала показываем папки, потом файлы
      if (leftFolder !== rightFolder) {
        return leftFolder ? -1 : 1
      }

      // Внутри одной группы сортируем элементы по имени
      return left.name.localeCompare(right.name)
    })
}

export function getVisibleItems(folder, searchQuery) {
  // Для обычного режима вернутся все элементы
  // Для поиска останутся только совпадения и папки с совпадениями внутри
  return getFolderItems(folder).filter(item => matchesSearch(item, searchQuery))
}

export function matchesSearch(item, searchQuery) {
  const query = searchQuery.trim().toLowerCase()

  if (!query) {
    return true
  }

  const { name, node } = item

  if (name.toLowerCase().includes(query)) {
    return true
  }

  if (!isFolder(node)) {
    return false
  }

  // Если сама папка не совпала по имени, ищем совпадение глубже
  return getFolderItems(node).some(child => matchesSearch(child, query))
}

export function pathToKey(path) {
  return path.join('/')
}

export function getPathParents(path) {
  return path.map((_, index) => path.slice(0, index + 1))
}

export function isFolder(node) {
  return Boolean(node && (node.type === 'folder' || node.children))
}

function getRootFolder(tree) {
  const root = tree.root ? tree.root : tree

  if (root.type === 'folder') {
    return root
  }

  return {
    type: 'folder',
    children: root.children || root
  }
}
