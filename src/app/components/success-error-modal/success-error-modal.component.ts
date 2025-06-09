import { Component, OnInit } from '@angular/core';
import { MessageModalConfig } from '../../../shared/interfaces/MessageModalConfig';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-error-modal',
  imports: [CommonModule,ModalModule],
  templateUrl: './success-error-modal.component.html',
  styleUrl: './success-error-modal.component.css'
})
export class SuccessErrorModalComponent implements OnInit  {

    config?: MessageModalConfig;

  constructor(public modalRef: BsModalRef) { }
  ngOnInit(): void {
    // Config will be set via initialState
  }
   close(): void {
    this.modalRef.hide();
  }

  getIconClass(): string {
    return this.config?.type || 'error';
  }

  getIconName(): string {
    return this.config?.type === 'success' ? 'fas fa-check' : 'fas fa-times';
  }

  getTitleClass(): string {
    return this.config?.type || 'error';
  }

  getButtonClass(): string {
    return this.config?.type || 'error';
  }
}
