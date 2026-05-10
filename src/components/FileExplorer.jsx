import { FileItem } from './FileItem.jsx'
import { getVisibleItems } from '../utils/tree.js'

export function FileExplorer({ folder, selectedPath, expandedFolders, searchQuery, onOpenFolder }) {
  const items = getVisibleItems(folder, searchQuery)

  if (!items.length) {
    return <p className="empty">{searchQuery ? 'Ничего не найдено' : 'Папка пустая'}</p>
  }

  return (
    <ul className="file-list">
      {items.map(({ name, node }) => (
        <FileItem
          key={name}
          name={name}
          node={node}
          path={[name]}
          level={0}
          selectedPath={selectedPath}
          expandedFolders={expandedFolders}
          searchQuery={searchQuery}
          onOpenFolder={onOpenFolder}
        />
      ))}
    </ul>
  )
}
