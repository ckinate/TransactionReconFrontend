import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-message-modal',
  imports: [ModalModule,CommonModule],
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.css'
})
export class MessageModalComponent {

    title: string = '';
  message: string = '';
  type: 'success' | 'error' | 'info' | 'warning' = 'info';
  buttonText: string = 'OK';
  buttonClass: string = 'btn-primary';

  constructor(public modalRef: BsModalRef) {}

   onClose(): void {
    this.modalRef.hide();
  }

  getIconClass(): string {
    switch (this.type) {
      case 'success':
        return 'fas fa-check-circle text-success';
      case 'error':
        return 'fas fa-times-circle text-danger';
      case 'warning':
        return 'fas fa-exclamation-triangle text-warning';
      case 'info':
      default:
        return 'fas fa-info-circle text-info';
    }
  }

  getHeaderClass(): string {
    switch (this.type) {
      case 'success':
        return 'header-success';
      case 'error':
        return 'header-error';
      case 'warning':
        return 'header-warning';
      case 'info':
      default:
        return 'header-info';
    }
  }

}
