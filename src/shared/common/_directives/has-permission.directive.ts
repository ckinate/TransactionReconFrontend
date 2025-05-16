import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {

  constructor(    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService) { }
  
   @Input() hasPermission: string | string[] = '';
  @Input() hasPermissionType: 'all' | 'any' = 'any';


  ngOnInit(): void {
      this.updateView();
    
    // Subscribe to user changes to update the view when permissions change
    this.authService.currentUser$.subscribe(() => {
      this.updateView();
    });
   
  }

   private updateView(): void {
    this.viewContainer.clear();
    
    if (this.checkPermissions()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private checkPermissions(): boolean {
    // Single permission check
    if (typeof this.hasPermission === 'string') {
      return this.authService.hasPermission(this.hasPermission);
    }
    
    // Multiple permissions check
    if (Array.isArray(this.hasPermission)) {
      if (this.hasPermissionType === 'all') {
        return this.authService.hasAllPermissions(this.hasPermission);
      } else {
        return this.authService.hasAnyPermission(this.hasPermission);
      }
    }
    
    return false;
  }

}
