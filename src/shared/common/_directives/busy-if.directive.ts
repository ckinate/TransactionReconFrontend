import { ComponentFactoryResolver, Directive, Injector, Input, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Directive({
  selector: '[busyIf]'
})
export class BusyIfDirective implements OnChanges {

  constructor(private _viewContainer: ViewContainerRef,
    private _injector: Injector) {
    this.ngxSpinnerService = _injector.get(NgxSpinnerService);
    this.loadComponent();
     }
  
    private static index = 0;
    @Input() busyIf: boolean = false;

    ngxSpinnerService: NgxSpinnerService;
    private spinnerName = '';

    isBusy = false;
  
  
  ngOnChanges(changes: SimpleChanges): void {
      if (changes['busyIf']) {
            this.isBusy = changes['busyIf'].currentValue;
            this.refreshState();
        }
  }
      refreshState(): void {
        if (this.isBusy === undefined || this.spinnerName === '') {
            return;
        }

        setTimeout(() => {
            if (this.isBusy) {
                this.ngxSpinnerService.show(this.spinnerName);
            } else {
                this.ngxSpinnerService.hide(this.spinnerName);
            }
        }, 1000);
  }
  
  loadComponent() {
    // Create the component directly using ViewContainerRef.createComponent
    const componentRef = this._viewContainer.createComponent(NgxSpinnerComponent);
    this.spinnerName = `busyIfSpinner-${BusyIfDirective.index++}-${Math.floor(Math.random() * 1000000)}`; // Generate random name

    // Access the component instance directly
    const component = componentRef.instance;
    component.name = this.spinnerName;
    component.fullScreen = false;
    component.type = 'ball-clip-rotate';
    component.size = 'medium';
    component.color = '#5ba7ea';
}

}
