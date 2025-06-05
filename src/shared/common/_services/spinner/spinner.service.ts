import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpinnerConfig } from '../../../interfaces/SpinnerConfig';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor() { }
    private loadingSubject = new BehaviorSubject<boolean>(false);
  private configSubject = new BehaviorSubject<SpinnerConfig>({});
  private requestCount = 0;
  private isDebugMode = false;

   get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  get config$(): Observable<SpinnerConfig> {
    return this.configSubject.asObservable();
  }

  get isLoading(): boolean {
    return this.loadingSubject.value;
  }
   // Enable debug mode to see console logs
  enableDebugMode(): void {
    this.isDebugMode = true;
  }

  show(config: SpinnerConfig = {}): void {
    this.requestCount++;
     if (this.isDebugMode) {
      console.log(`[SpinnerService] show() called. Request count: ${this.requestCount}`);
    }
    if (this.requestCount === 1) {
      this.configSubject.next({
        message: 'Loading...',
        type: 'border',
        size: 'md',
        color: 'primary',
        backdrop: true,
        ...config
      });
      this.loadingSubject.next(true);
       if (this.isDebugMode) {
        console.log('[SpinnerService] Spinner shown');
      }
    }
  }

   hide(): void {
    if (this.requestCount > 0) {
      this.requestCount--;
     }
     
      if (this.isDebugMode) {
      console.log(`[SpinnerService] hide() called. Request count: ${this.requestCount}`);
    }
    
    if (this.requestCount === 0) {
      this.loadingSubject.next(false);
     }
        if (this.isDebugMode) {
        console.log('[SpinnerService] Spinner hidden');
      }
     else if (this.requestCount < 0) {
      // Safety check - should not happen
      console.warn('[SpinnerService] Request count went negative, forcing reset');
      this.forceHide();
    }
  }
  forceHide(): void {
      if (this.isDebugMode) {
      console.log(`[SpinnerService] forceHide() called. Previous request count: ${this.requestCount}`);
    }
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }

   // New method: show without request counting (for manual control)
  showDirect(config: SpinnerConfig = {}): void {
    this.configSubject.next({
      message: 'Loading...',
      type: 'border',
      size: 'md',
      color: 'primary',
      backdrop: true,
      ...config
    });
    this.loadingSubject.next(false);
    
    if (this.isDebugMode) {
      console.log('[SpinnerService] Direct spinner shown (no counting)');
    }
  }

  // New method: hide without request counting (for manual control)
  hideDirect(): void {
    this.loadingSubject.next(false);
    
    if (this.isDebugMode) {
      console.log('[SpinnerService] Direct spinner hidden (no counting)');
    }
  }

  updateConfig(config: Partial<SpinnerConfig>): void {
    const currentConfig = this.configSubject.value;
    this.configSubject.next({ ...currentConfig, ...config });
  }
}
