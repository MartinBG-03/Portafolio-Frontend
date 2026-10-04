export const CATALOG_ENDPOINTS = {
  base: 'catalogs',
  search: 'catalogs/search',
  tree: 'catalogs/tree',
  byId: (id: number) => `catalogs/${id}`,
  status: (id: number) => `catalogs/${id}/status`,
} as const;
