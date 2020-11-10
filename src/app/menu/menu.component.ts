import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { NotificationsService } from './../services/notifications.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  numberOfNotifications: number;
  admin: boolean;

  constructor(private notifications: NotificationsService, private auth: AuthService) { }

  ngOnInit(): void {

    console.log("admin");
    this.admin = this.auth.isAdmin();
    this.numberOfNotifications = this.notifications.getNumberOfNotifications();
  }

}
