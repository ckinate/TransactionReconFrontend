import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-role',
  imports: [CommonModule,RouterModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit{

  constructor() { }
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
