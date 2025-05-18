import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }
  handleError(error: HttpErrorResponse): Observable<never>{
    let errorMessage = 'An unknown error occurred';
    // Client-side or network error
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } 
    // Server-side error
    else {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Server error: ${error.status} - ${error.message}`;
      }
    }
    // Log error for debugging
    console.error('Error occurred:', {
      message: errorMessage,
      status: error.status,
      url: error.url,
    });

    // Optionally, integrate with a logging service
    // this.loggingService.logError(error);

    // Propagate error to the component
    return throwError(() => new Error(errorMessage));
  }
}
