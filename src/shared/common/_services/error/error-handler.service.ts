import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }
  
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    // Client-side or network error
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } 
    // Server-side error
    else {
      switch (error.status) {
        case 400:
          // Check server response message first
          if (error?.error?.message) {
          return  errorMessage = error.error.message;
          }
          else if (error?.message) {
           
            errorMessage = `Error: ${error.message}`;
          }
          else if (error?.error && error?.error?.errors) {
            errorMessage = Object.values(error?.error?.errors).flat().join('');
          }
          else if (Array.isArray(error?.error)) {
            errorMessage = error?.error?.map((err: any) => err?.description).join(' ');
          }
          else {
            errorMessage = 'Bad request. Please check your input.';
          }
          break;
          
        case 401:
          // Check server response message first (this is the key fix)
          if (error?.error?.message) {
          return  errorMessage = error.error.message;Me
          }
          else if (error?.message) {
            errorMessage = `Error: ${error.message}`;
          }
          else {
            errorMessage = 'Unauthorized. Please log in again.';
          }
          break;
          
        case 403:
          if (error?.error?.message) {
          return  errorMessage = error.error.message;
          }
          else {
            errorMessage = 'Unauthorized. Access denied. No permission granted';
          }
          break;
          
        case 404:
          if (error?.error?.message) {
          return  errorMessage = error.error.message;
          }
          else if (error?.message) {
            errorMessage = `Error: ${error.message}`;
          }
          else {
            errorMessage = 'Resource not found.';
          }
          break;
          
        case 500:
          if (error?.error?.message) {
           return errorMessage = error.error.message;
          }
          else if (error?.message) {
            errorMessage = `Error: ${error.message}`;
          }
          else {
            errorMessage = 'Server error. Please try again later.';
          }
          break;
          
        default:
          if (error?.error?.message) {
           return errorMessage = error.error.message;
          }
          else {
            errorMessage = `Server error: ${error.status} - ${error.message}`;
          }
      }
    }
    
    // Log error for debugging
    console.error('Error occurred:', {
      message: errorMessage,
      status: error.status,
      url: error.url,
      fullError: error // Add full error for debugging
    });

    // Optionally, integrate with a logging service
    // this.loggingService.logError(error);

    // Propagate error to the component
    return throwError(() => new Error(errorMessage));
  }
}