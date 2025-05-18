import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../../../interfaces/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../interfaces/LoginRequest';
import { AuthResponse } from '../../../interfaces/AuthResponse';
import { RegisterRequest } from '../../../interfaces/RegisterRequest';
import { RefreshTokenRequest } from '../../../interfaces/RefreshTokenRequest';
import { ErrorHandlerService } from '../error/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/Auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;
  private jwtHelper = new JwtHelperService();
    public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private errorHandler: ErrorHandlerService) {
     this.checkForStoredAuth();
  }
  
    get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
    login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => this.handleAuthentication(response, loginData.rememberMe)),
       // catchError(this.handleError),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
      );
  }
  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        tap(response => this.handleAuthentication(response, true)),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
       // catchError(this.handleError)
      );
  }
    logout() {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    
    // Clear session storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userData');
    
    // Clear user subject
    this.currentUserSubject.next(null);
    
    // Clear timer if exists
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    
    // Navigate to login
    this.router.navigate(['/login']);
  }
    refreshToken(): Observable<AuthResponse> {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    
    if (!token || !refreshToken) {
      return throwError(() => new Error('No token available'));
    }
    
    const refreshRequest: RefreshTokenRequest = {
      token,
      refreshToken
    };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, refreshRequest)
      .pipe(
        tap(response => {
          const isRememberMe = !!localStorage.getItem('token');
          this.handleAuthentication(response, isRememberMe);
        }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
       // catchError(this.handleError)
      );
  }

    hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.permissions?.includes(permission) || false;
  }
    hasAnyPermission(permissions: string[]): boolean {
    const user = this.currentUserSubject.value;
    return permissions.some(permission => user?.permissions?.includes(permission)) || false;
  }
    hasAllPermissions(permissions: string[]): boolean {
    const user = this.currentUserSubject.value;
    return permissions.every(permission => user?.permissions?.includes(permission)) || false;
  }
   hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes(role) || false;
  }

    private handleAuthentication(response: AuthResponse, rememberMe: boolean) {
    if (!response.success || !response.token) {
      return;
    }
    
    const user: User = {
      id: response.userId,
      email: response.email,
      firstName: response.firstName, // These would come from the API
      lastName: response.lastName,  // or from the decoded token
      roles: response.roles,
      permissions: response.permissions
    };
    
    this.currentUserSubject.next(user);
    
    // Store tokens and user data based on rememberMe preference
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', response.token);
    storage.setItem('refreshToken', response.refreshToken);
    storage.setItem('userData', JSON.stringify(user));
    
    // Set auto-logout timer
    const expirationDuration = new Date(response.expireAt).getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
  }

    private checkForStoredAuth() {
    // Check localStorage first, then sessionStorage
    let token = localStorage.getItem('token') || sessionStorage.getItem('token');
    let userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (!token || !userData) {
      return;
    }
    
    const user: User = JSON.parse(userData);
    
    // Check if token is expired
    if (this.jwtHelper.isTokenExpired(token)) {
      // If token is expired, try to refresh
      this.refreshToken().subscribe({
        error: () => this.logout()
      });
      return;
    }
    
    // Set current user
    this.currentUserSubject.next(user);
    
    // Set auto-logout timer
    const expirationDuration = this.jwtHelper.getTokenExpirationDate(token)!.getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
  }

    private autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      // Check if we can refresh the token
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        this.refreshToken().subscribe({
          error: () => this.logout()
        });
      } else {
        this.logout();
      }
    }, expirationDuration);
  }

  private getToken(): string {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }
    private getRefreshToken(): string {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken') || '';
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error?.message) {
      // Server-side error with message
      errorMessage = error.error.message;
    } else if (error.status) {
      // Server-side error with status
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
