import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { SpinnerConfig } from '../../../shared/interfaces/SpinnerConfig';
import { SpinnerService } from '../../../shared/common/_services/spinner/spinner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent implements OnInit, OnDestroy {

   @Input() local: boolean = false; // true for component-level, false for global
  @Input() showProgress: boolean = false; // show progress bar
  @Input() isDarkMode: boolean = false; // manual dark mode toggle
  spinnerData$!: Observable<{ isLoading: boolean; config: SpinnerConfig }>;
  private destroy$ = new Subject<void>();

  constructor(private spinnerService: SpinnerService) {}
  
  ngOnInit(): void {
     this.spinnerData$ = combineLatest([
      this.spinnerService.isLoading$,
      this.spinnerService.config$
    ]).pipe(
      takeUntil(this.destroy$),
      map(([isLoading, config]) => ({ isLoading, config }))
    );
  }

  ngOnDestroy(): void {
      this.destroy$.next();
    this.destroy$.complete();
  }

    getSpinnerClasses(config: SpinnerConfig): string {
    const baseClass = config.type === 'grow' ? 'spinner-grow' : 'spinner-border';
    const sizeClass = this.getSizeClass(config.size || 'md');
    const colorClass = `text-${config.color || 'primary'}`;
    
    return `${baseClass} ${sizeClass} ${colorClass}`;
  }

    private getSizeClass(size: string): string {
    switch (size) {
      case 'sm':
        return 'spinner-border-sm';
      case 'lg':
        return 'spinner-border-xl';
      default:
        return '';
    }
  }

}
