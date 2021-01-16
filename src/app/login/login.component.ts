import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../entitites/User';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  hide = true;
  message = "Enter your email to reset your password!";
  forgotPassword: boolean;
  emailToResetPassword: string;
  sent: boolean = false;
  authError: any;
  user: User;
  searchedDoctor;
  roleErrorMessage: string;
  userPasswordError: string;
  errorMessage;

  constructor(private auth: AuthService, private userService: UserService,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.roleErrorMessage = null;
    this.userPasswordError = null;
    this.auth.eventAuthError$.subscribe( data => {
      this.authError = data;
    });

    this.forgotPassword = false;

  }

  onClick() {
    this.router.navigate(['/forgotPassword']);
  }

  emailSent() {
    this.message = "Email successfully sent!";
    this.sent = true;
  }

  login() {
    this.errorMessage=null;
    this.roleErrorMessage=null;
    this.user = new User();
    this.user.email = this.email;
    this.user.password = this.password;
    this.userService.getDoctors().pipe(
      map(v =>
       v.filter(user => user.email === this.email)
      )
    ).subscribe(doctor => {
        this.searchedDoctor = doctor[0];
        console.log(this.searchedDoctor);
        if (this.searchedDoctor || this.email === "adminsupport@yahoo.com")
         {
           this.auth.login(this.user.email, this.user.password);
            this.errorMessage=localStorage.getItem('message');

        }
          else { this.roleErrorMessage = "You are not allowed to login, please use mobile app instead!"; }
      });

    }

}
