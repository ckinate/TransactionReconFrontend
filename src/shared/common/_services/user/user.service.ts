import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ErrorHandlerService } from '../error/error-handler.service';
import { catchError, Observable } from 'rxjs';
import { GetPaginatedUser } from '../../../interfaces/GetPaginatedUser';
import { GetPaginatedUserInput } from '../../../interfaces/GetPaginatedUserInput';

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
}
