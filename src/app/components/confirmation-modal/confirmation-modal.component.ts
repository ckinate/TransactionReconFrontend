import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation-modal',
  imports: [ModalModule,CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {
  title: string = 'Confirmation';
  message: string = '';
  confirmText: string = 'Yes';
  cancelText: string = 'Cancel';
  confirmButtonClass: string = 'btn-danger';
  cancelButtonClass: string = 'btn-secondary';
  result: boolean = false;
   constructor(public modalRef: BsModalRef) {}



   onConfirm(): void {
    this.result = true;
    this.modalRef.hide();
  }

  onCancel(): void {
    this.result = false;
    this.modalRef.hide();
  }
}
