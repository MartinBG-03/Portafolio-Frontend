export interface AuthUser {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly profilePhotoUrl: string | null;
}

export interface AuthResult {
  readonly token: string;
  readonly expiresAtUtc: string;
  readonly user: AuthUser;
}
