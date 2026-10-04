export interface ApiResponse<T = undefined> {
  readonly isSuccess: boolean;
  readonly message?: string;
  readonly data?: T;
}
