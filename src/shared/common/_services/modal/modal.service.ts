import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationModalData } from '../../../interfaces/ConfirmationModalData';
import { from, map, Observable, Subject, switchMap, take } from 'rxjs';
import { MessageModalData } from '../../../interfaces/MessageModalData';
// Direct imports - make sure paths are correct
import { ConfirmationModalComponent } from '../../../../app/components/confirmation-modal/confirmation-modal.component';
import { MessageModalComponent } from '../../../../app/components/message-modal/message-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
    private modalRef?: BsModalRef;
     private modalService = inject(BsModalService);



   // Confirmation Modal
     openConfirmationModal(data: ConfirmationModalData): Observable<boolean> {
    const initialState = {
      title: data.title || 'Confirmation',
      message: data.message,
      confirmText: data.confirmText || 'Yes',
      cancelText: data.cancelText || 'Cancel',
      confirmButtonClass: data.confirmButtonClass || 'btn-danger',
      cancelButtonClass: data.cancelButtonClass || 'btn-secondary'
    };

    this.modalRef = this.modalService.show(ConfirmationModalComponent, {
      initialState,
     // class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    });

    // Create a subject to handle the result
    const resultSubject = new Subject<boolean>();

    // Subscribe to modal hide event
    this.modalRef.onHide?.subscribe(() => {
      const result = this.modalRef?.content?.result || false;
      resultSubject.next(result);
      resultSubject.complete();
    });

    return resultSubject.asObservable().pipe(take(1));
  }

    // Success Modal
     openSuccessModal(message: string, title?: string, buttonText?: string): Observable<any> {
    return from(this.openMessageModal({
      title: title || 'Success',
      message,
      type: 'success',
      buttonText: buttonText || 'OK',
      buttonClass: 'btn-success'
    })).pipe(
      switchMap(obs => obs)
    );
  }

    // Error Modal
      openErrorModal(message: string, title?: string, buttonText?: string): Observable<any> {
    return from(this.openMessageModal({
      title: title || 'Error',
      message,
      type: 'error',
      buttonText: buttonText || 'OK',
      buttonClass: 'btn-danger'
    })).pipe(
      switchMap(obs => obs)
    );
  }

  // Info Modal
   openInfoModal(message: string, title?: string, buttonText?: string): Observable<any> {
    return from(this.openMessageModal({
      title: title || 'Information',
      message,
      type: 'info',
      buttonText: buttonText || 'OK',
      buttonClass: 'btn-primary'
    })).pipe(
      switchMap(obs => obs)
    );
  }

   // Warning Modal
    openWarningModal(message: string, title?: string, buttonText?: string): Observable<any> {
    return from(this.openMessageModal({
      title: title || 'Warning',
      message,
      type: 'warning',
      buttonText: buttonText || 'OK',
      buttonClass: 'btn-warning'
    })).pipe(
      switchMap(obs => obs)
    );
  }

    // Generic Message Modal
     private openMessageModal(data: MessageModalData): Observable<any> {
    const initialState = {
      title: data.title,
      message: data.message,
      type: data.type,
      buttonText: data.buttonText || 'OK',
      buttonClass: data.buttonClass || 'btn-primary'
    };

    this.modalRef = this.modalService.show(MessageModalComponent, {
      initialState,
     // class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    });

    // Create a subject for completion
    const completionSubject = new Subject<void>();

    this.modalRef.onHide?.subscribe(() => {
      completionSubject.next();
      completionSubject.complete();
    });

    return completionSubject.asObservable().pipe(take(1));
  }

    // Close modal programmatically
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  
}
