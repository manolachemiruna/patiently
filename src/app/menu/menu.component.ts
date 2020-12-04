import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  numberOfAppointments: string;
  admin: boolean;
  loggedIn: boolean;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {

    this.admin = this.auth.isAdmin();
    this.numberOfAppointments = sessionStorage.getItem('numberOfAppointments');
    if (this.auth.isLoggedIn) { this.loggedIn = true; }
    else { this.loggedIn = false; }
  }

  getNumberOfAppointments($event)
  {
    this.numberOfAppointments = sessionStorage.getItem('numberOfAppointments');
  }

}
