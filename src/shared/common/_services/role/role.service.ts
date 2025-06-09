import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ErrorHandlerService } from '../error/error-handler.service';
import { GetPaginatedRoleInput } from '../../../interfaces/GetPaginatedRoleInput';
import { catchError, Observable } from 'rxjs';
import { GetPaginatedRole } from '../../../interfaces/GetPaginatedRole';
import { GetRoleDto } from '../../../interfaces/GetRoleDto';
import { RoleDto } from '../../../interfaces/RoleDto';
import { PermissionDto } from '../../../interfaces/PermissionDto';
import { UserRoleDto } from '../../../interfaces/UserRoleDto';
import { User } from '../../../interfaces/User';
import { PermissionNode } from '../../../interfaces/PermissionNode';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/api/Roles`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

    paginatedRoles(input: GetPaginatedRoleInput): Observable<GetPaginatedRole> {
    // Build query parameters
    let params = new HttpParams()
      .set('Filter', input.filter)
      .set('PageIndex', input.pageIndex.toString())
      .set('PageSize', input.pageSize.toString());
    
    return this.http.get<GetPaginatedRole>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
    
  }
   getRole(id: string): Observable<GetRoleDto>{
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<GetRoleDto>(url).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
      );
  }
  getRoles(): Observable<GetRoleDto[]> {
    const url = `${this.apiUrl}/role`;
    return this.http.get<GetRoleDto[]>(url).pipe(
       catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
    
  }
   createRole(role: RoleDto): Observable<any> {
       return this.http.post<any>(`${this.apiUrl}`, role,{ observe: 'response' })
            .pipe(
              catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
            );
  }
  
    updateRole(id: string, role: RoleDto): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}`, role, { observe: 'response' }).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
      );
  }
   deleteRole(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { observe: 'response' }).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    )
  }
 addPermissionToRole(roleId: string,permissionDto:PermissionDto): Observable<any> {
      return this.http.post(`${this.apiUrl}/${roleId}/permissions`, permissionDto, { observe: 'response' }).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
      )
  }

 removePermissionFromRole(roleId: string, permissionName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${roleId}/permissions/${permissionName}`,{ observe: 'response' }).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    )
  }

  addUserToRole(roleId: string,userRoleDto: UserRoleDto): Observable<any> {
      return this.http.post(`${this.apiUrl}/${roleId}/users`, userRoleDto, { observe: 'response' }).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
      )
  }
  removeUserFromRole(roleId: string, userId: string) {
      return this.http.delete(`${this.apiUrl}/${roleId}/users/${userId}`,{ observe: 'response' }).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    )
  }
  getUsersInRole(roleId: string): Observable<User[]>{
     return this.http.get<User[]>(`${this.apiUrl}/${roleId}/users`).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
      )
  }
  getAllPermissions(): Observable<string[]> {
     return this.http.get<string[]>(`${this.apiUrl}/permissions`).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
      )
  }
   // Get all permissions in tree format
  getPermissionsTree(): Observable<PermissionNode[]> {
    return this.http.get<PermissionNode[]>(`${this.apiUrl}/permissionsTree`).pipe(
       catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
  }
}
