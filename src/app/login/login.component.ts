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
    this.auth.login(this.user.email, this.user.password)
    .catch(error => {
      if (error.code === 'auth/invalid-email') {
        this.errorMessage='Please enter a valid email address!';
    } else if (error.code === 'auth/user-not-found') {
       this.errorMessage='There is no user coresponding to this identifier!';
    } else if (error.code === 'auth/wrong-password') {
        this.errorMessage='The password is invalid or the user does not have a password!';
    }
    })
    .then(userCredential => {
      if (userCredential) {
        sessionStorage.setItem('user', this.user.email);
        sessionStorage.setItem('uid',userCredential.user.uid);
        if (this.auth.isAdmin()) { this.router.navigate(['/admin']); } else { this.router.navigate(['/appointments']); }
      }
    });


  }

}
