import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../providers/user.service';
import { Router } from '@angular/router';
import { element } from 'protractor';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username: ['', Validators.compose([
      Validators.required
    ])],
    password: ['', Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20)
    ])]
  });
  auth2: any;
  constructor(
    protected fb: FormBuilder,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.googleInit();
  }
  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '992244002552-oa6d3kukfjfe15q3pnt7m0jfmk3g5cnf.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignIn(document.getElementById('btngoogle'));
    });
  }
  attachSignIn(element: any) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;

      this.userService.singInGoogle(token).subscribe(data => {
        this.router.navigate(['/home']);
      });
    })
  }
  signIn() {
    console.log(this.loginForm.value);
    this.userService.singIn(this.loginForm.value).subscribe(data => {
      this.router.navigate(['/home']);
    });
  }
  get loginFormInvalid() {
    return this.loginForm.invalid;
  }

  public get loginFormControl() {
    return this.loginForm.controls;
  }
  get userNameErrorRequired() {
    return this.loginFormControl.username.hasError('required');
  }

  get passwordErrorRequired() {
    return this.loginFormControl.password.hasError('required');
  }

}
