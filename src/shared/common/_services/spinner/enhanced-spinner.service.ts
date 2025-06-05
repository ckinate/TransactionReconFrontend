import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SpinnerService } from './spinner.service';
import { SimpleSpinnerConfig, SpinnerConfig } from '../../../interfaces/SpinnerConfig';
import { SpinnerModalComponent } from '../../../../app/components/spinner-modal/spinner-modal.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnhancedSpinnerService  {

  private spinnerSubject = new BehaviorSubject<SimpleSpinnerConfig>({ show: false });
  
  // Public observable
  spinner$ = this.spinnerSubject.asObservable();

  constructor() {
    // Debug: Log every state change
    this.spinner$.subscribe(state => {
      console.log('[SimpleSpinnerService] State changed:', state);
    });
  }
    show(message: string = 'Loading...') {
    console.log('[SimpleSpinnerService] SHOW called with message:', message);
    this.spinnerSubject.next({ show: true, message });
  }

  hide() {
    console.log('[SimpleSpinnerService] HIDE called');
    this.spinnerSubject.next({ show: false });
  }

  // Get current state for debugging
  getCurrentState() {
    return this.spinnerSubject.value;
  }
}
