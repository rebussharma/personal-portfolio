export interface TilEntry {
  id: string
  subject: string
  content: string
  tags: string[]
  date: string
  updatedDate: string | null
}

type TilRow = {
  id: string
  subject: string
  content: string
  tags: string[] | null
  created_at: string
  updated_at: string | null
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

export function formatEntries(rows: TilRow[]): TilEntry[] {
  return rows.map((row) => ({
    id: row.id,
    subject: row.subject,
    content: row.content,
    tags: row.tags ?? [],
    date: formatDate(row.created_at),
    updatedDate: row.updated_at ? formatDate(row.updated_at) : null,
  }))
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
