import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../entitites/User';

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
              private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.roleErrorMessage = null;
    this.userPasswordError = null;
    this.forgotPassword = false;

  }

  public onClick(): void {
    this.router.navigate(['/forgotPassword']);
  }

  public emailSent(): void {
    this.message = "Email successfully sent!";
    this.sent = true;
  }

  public login(): void {
    this.errorMessage=null;
    this.roleErrorMessage=null;
    this.user = new User();
    this.user.email = this.email;
    this.user.password = this.password;
    this.auth.login(this.user.email, this.user.password);

  }

}
