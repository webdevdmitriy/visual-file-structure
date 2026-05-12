import { ChevronIcon, FileIcon, FolderIcon } from './Icons.jsx'
import { getVisibleItems, isFolder, pathToKey } from '../utils/tree.js'

export function FileItem({
  name,
  node,
  path,
  level,
  selectedPath,
  expandedFolders,
  searchQuery,
  onOpenFolder
}) {
  const isFolderItem = isFolder(node)
  const pathKey = pathToKey(path)
  const isSearchActive = Boolean(searchQuery.trim())
  const expanded = isSearchActive || expandedFolders.has(pathKey)
  const selected = pathKey === pathToKey(selectedPath)
  const rowStyle = { paddingLeft: `${10 + level * 18}px` }

  if (isFolderItem) {
    const children = getVisibleItems(node, searchQuery)

    return (
      <li>
        <button
          className={`file-row file-row_button ${selected ? 'file-row_active' : ''}`}
          style={rowStyle}
          onClick={() => onOpenFolder(path)}
        >
          <ChevronIcon open={expanded} />
          <FolderIcon />
          <span>{name}</span>
        </button>

        {expanded && Boolean(children.length) && (
          <ul className="file-list">
            {children.map(({ name: childName, node: childNode }) => (
              // Рекурсия позволяет отрисовать дерево любой глубины
              <FileItem
                key={childName}
                name={childName}
                node={childNode}
                path={[...path, childName]}
                level={level + 1}
                selectedPath={selectedPath}
                expandedFolders={expandedFolders}
                searchQuery={searchQuery}
                onOpenFolder={onOpenFolder}
              />
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li className="file-row" style={rowStyle}>
      <span className="file-row__spacer" />
      <FileIcon />
      <span>{name}</span>
    </li>
  )
}
