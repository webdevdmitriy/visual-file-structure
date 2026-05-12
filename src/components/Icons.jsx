export function FolderIcon() {
  return (
    <svg className="icon icon_folder" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
    </svg>
  )
}

export function FileIcon() {
  return (
    <svg className="icon icon_file" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4" />
    </svg>
  )
}

export function ChevronIcon({ open }) {
  return (
    <svg className={`icon icon_chevron ${open ? 'icon_chevron_open' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}
