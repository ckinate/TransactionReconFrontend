import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/common/_services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../shared/interfaces/User';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log(`The user is ${JSON.stringify(user)}`);
       this.currentUser?.firstName
       this.currentUser?.lastName
    });
  }
 
  username: string = 'erp.audit';
  currentUser!: User | null;

   ngOnInit(): void {
    
  }

  logOut() {
    this.authService.logout();
     this.router.navigate(['/login']);
  }

}
