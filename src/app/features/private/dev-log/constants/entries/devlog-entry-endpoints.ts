export const DEVLOG_ENTRY_ENDPOINTS = {
  base: 'devlog-entries',
  search: 'devlog-entries/search',
  byId: (id: number) => `devlog-entries/${id}`,
  status: (id: number) => `devlog-entries/${id}/status`,
  featured: (id: number) => `devlog-entries/${id}/featured`,
} as const;
