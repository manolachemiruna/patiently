import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input() numberOfAppointments: string;
  admin: boolean;
  loggedIn: boolean;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {

    this.admin = this.auth.isAdmin();
    if (this.auth.isLoggedIn()) { this.loggedIn = true; }
    else { this.loggedIn = false; }
  }

}
