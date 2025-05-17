import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmModalConfig } from '../../../shared/interfaces/ConfirmModalConfig';
import { Subscription } from 'rxjs';
import { ConfirmModalService } from '../../../shared/common/_services/confirmModal/confirm-modal.service';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule,RouterModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
   isVisible = false;
  config: ConfirmModalConfig | null = null;
  private subscription: Subscription | null = null;
   constructor(private confirmModalService: ConfirmModalService) {}

  ngOnInit(): void {
       this.subscription = this.confirmModalService.modalConfig$.subscribe(config => {
      this.config = config;
      this.isVisible = true;
    });
  }

   onConfirm() {
    this.confirmModalService.confirm(true);
    this.isVisible = false;
  }

  onCancel() {
    this.confirmModalService.confirm(false);
    this.isVisible = false;
  }


    ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
