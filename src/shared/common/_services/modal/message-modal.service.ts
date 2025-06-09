import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessageModalConfig } from '../../../interfaces/MessageModalConfig';
import { SuccessErrorModalComponent } from '../../../../app/components/success-error-modal/success-error-modal.component';

@Injectable({
  providedIn: 'root'
})
export class MessageModalService {

  constructor(private modalService: BsModalService) { }
   private modalRef?: BsModalRef;

  showSuccess(message: string, title: string = 'Success!'): void {
    this.show({
      title,
      message,
      type: 'success'
    });
  }

  showError(message: string, title: string = 'Error!'): void {
    this.show({
      title,
      message,
      type: 'error'
    });
  }

  private show(config: MessageModalConfig): void {
    const initialState = {
      config: {
        ...config,
        confirmButtonText: config.confirmButtonText || 'OK'
      }
    };

    this.modalRef = this.modalService.show(SuccessErrorModalComponent, {
      initialState,
      class: 'modal-dialog-centered',
      backdrop: 'static',
      keyboard: false
    });
  }

  hide(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
