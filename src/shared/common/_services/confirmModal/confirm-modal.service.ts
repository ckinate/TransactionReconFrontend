import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfirmModalConfig } from '../../../interfaces/ConfirmModalConfig';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {

  constructor() { }
   private modalState = new Subject<boolean>();
  private modalConfig = new Subject<ConfirmModalConfig>();

   modalState$ = this.modalState.asObservable();
  modalConfig$ = this.modalConfig.asObservable();
  
   show(config: ConfirmModalConfig): Promise<boolean> {
    this.modalConfig.next(config);
    return new Promise((resolve) => {
      const subscription = this.modalState$.subscribe((result) => {
        resolve(result);
        subscription.unsubscribe();
      });
    });
  }

  confirm(result: boolean) {
    this.modalState.next(result);
  }
}
