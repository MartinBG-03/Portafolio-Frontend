import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../../models/api-response.interface';
import { AUTH_ENDPOINTS } from '../constants/auth-endpoints';
import { AuthResult, AuthUser } from '../models/auth-user.interface';

const STORAGE_KEY = 'admin_auth_session';

interface StoredSession {
  readonly token: string;
  readonly expiresAtUtc: string;
  readonly user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly session = signal<StoredSession | null>(this.readSession());

  readonly token = computed(() => this.session()?.token ?? null);
  readonly currentUser = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => {
    const value = this.session();
    return !!value && new Date(value.expiresAtUtc).getTime() > Date.now();
  });

  login(email: string, password: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(AUTH_ENDPOINTS.login, { email, password });
  }

  verifyOtp(email: string, code: string): Observable<ApiResponse<AuthResult>> {
    return this.http
      .post<ApiResponse<AuthResult>>(AUTH_ENDPOINTS.verifyOtp, { email, code })
      .pipe(
        tap((response) => {
          if (response.isSuccess && response.data) {
            this.setSession(response.data);
          }
        }),
      );
  }

  logout(): void {
    this.session.set(null);
    this.writeSession(null);
  }

  private setSession(result: AuthResult): void {
    const value: StoredSession = {
      token: result.token,
      expiresAtUtc: result.expiresAtUtc,
      user: result.user,
    };
    this.session.set(value);
    this.writeSession(value);
  }

  private readSession(): StoredSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredSession) : null;
    } catch {
      return null;
    }
  }

  private writeSession(value: StoredSession | null): void {
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      return;
    }
  }
}
