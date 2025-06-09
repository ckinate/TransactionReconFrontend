import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../../_services/auth/auth.service';

// State management for token refresh
let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  
  // Skip authentication for login/register/refresh endpoints
  if (isAuthUrl(req.url)) {
    return next(req);
  }

  const token = getToken();
  
  if (token) {
    req = addTokenToRequest(req, token);
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function isAuthUrl(url: string): boolean {
  // Check for Auth API endpoints
  return url.includes('/api/Auth/login') || 
         url.includes('/api/Auth/register') || 
         url.includes('/api/Auth/refresh-token')||
         url.includes('/api/Auth/verify-email')  ||
         // Keep the old patterns as fallback
         url.includes('/auth/login') || 
         url.includes('/auth/register') || 
         url.includes('/auth/refresh-token');
}

function getToken(): string {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
}

function addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(
  request: HttpRequest<any>, 
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(response => {
        isRefreshing = false;
        refreshTokenSubject.next(response.token);
        return next(addTokenToRequest(request, response.token));
      }),
      catchError(error => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => error);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token => next(addTokenToRequest(request, token)))
  );
}