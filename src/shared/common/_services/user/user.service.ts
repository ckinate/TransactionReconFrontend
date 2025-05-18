import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ErrorHandlerService } from '../error/error-handler.service';
import { catchError, Observable } from 'rxjs';
import { GetPaginatedUser } from '../../../interfaces/GetPaginatedUser';
import { GetPaginatedUserInput } from '../../../interfaces/GetPaginatedUserInput';
import { GetUserDto } from '../../../interfaces/GetUserDto';
import { CreateUser } from '../../../interfaces/CreateUser';
import { UserUpdateDto } from '../../../interfaces/UserUpdateDto';
import { PermissionDto } from '../../../interfaces/PermissionDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   private apiUrl = `${environment.apiUrl}/api/Users`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }
  
  paginatedUsers(input: GetPaginatedUserInput): Observable<GetPaginatedUser> {
    // Build query parameters
    let params = new HttpParams()
      .set('Filter', input.filter)
      .set('PageIndex', input.pageIndex.toString())
      .set('PageSize', input.pageSize.toString());
    
    return this.http.get<GetPaginatedUser>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
    
  }
  getUser(id: string): Observable<GetUserDto>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<GetUserDto>(url).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
  }
  createUser(user: CreateUser): Observable<any> {
     return this.http.post<any>(`${this.apiUrl}`, user,{ observe: 'response' })
          .pipe(
            catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
           
          );
    
  }
  updateUser(id: string, user: UserUpdateDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user, { observe: 'response' }).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
  }
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { observe: 'response' }).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    )
  }
  addPermissionToUser(userId: string,permissionDto:PermissionDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/permissions`, permissionDto, { observe: 'response' }).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    )
  }
  removePermissionFromUser(userId: string, permissionName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/permissions/${permissionName}`,{ observe: 'response' }).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    )
  }

}
