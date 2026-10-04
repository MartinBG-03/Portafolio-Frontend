export interface Catalog {
  readonly id: number;
  readonly parentId?: number;
  readonly code: string;
  readonly nameEn: string;
  readonly nameEs: string;
  readonly descriptionEn?: string;
  readonly descriptionEs?: string;
  readonly sortOrder: number;
  readonly status: boolean;
  readonly isSystemCatalog: boolean;
  readonly dateCreated: string;
  readonly dateUpdated?: string;
  readonly childrenCount: number;
}

export interface CatalogTreeNode {
  readonly id: number;
  readonly parentId?: number;
  readonly code: string;
  readonly nameEn: string;
  readonly nameEs: string;
  readonly descriptionEn?: string;
  readonly descriptionEs?: string;
  readonly sortOrder: number;
  readonly status: boolean;
  readonly level: number;
  readonly namePathEn: string;
  readonly namePathEs: string;
}
