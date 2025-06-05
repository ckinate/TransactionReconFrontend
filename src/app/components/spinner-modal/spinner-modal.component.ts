import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SpinnerConfig } from '../../../shared/interfaces/SpinnerConfig';
import { Subject, takeUntil } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SpinnerService } from '../../../shared/common/_services/spinner/spinner.service';
import { CommonModule } from '@angular/common';
import { EnhancedSpinnerService } from '../../../shared/common/_services/spinner/enhanced-spinner.service';

@Component({
  selector: 'app-spinner-modal',
  imports: [CommonModule],
  templateUrl: './spinner-modal.component.html',
  styleUrl: './spinner-modal.component.css'
})
export class SpinnerModalComponent implements OnInit, OnDestroy {

  constructor(public spinnerService: EnhancedSpinnerService) {
    // Additional debugging
    console.log('[SimpleSpinnerComponent] Component initialized');
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }



}
