import { PagedQuery } from '../../../../../core/models/paged-result.interface';
import { AdColumnFilterValue } from '../../../../../shared/private/interfaces/ad-filter.interface';

export interface SearchCatalogsRequest extends PagedQuery {
  readonly parentId?: number | null;
  readonly search?: string | null;
  readonly filters?: readonly AdColumnFilterValue[];
}

export interface CatalogTreeQuery {
  readonly rootId?: number | null;
  readonly onlyActive?: boolean;
}

export interface CreateCatalogRequest {
  readonly parentId?: number | null;
  readonly code: string;
  readonly nameEn: string;
  readonly nameEs: string;
  readonly descriptionEn?: string | null;
  readonly descriptionEs?: string | null;
  readonly sortOrder: number;
  readonly isSystemCatalog?: boolean;
}

export type UpdateCatalogRequest = CreateCatalogRequest;

export interface ChangeCatalogStatusRequest {
  readonly status: boolean;
}
