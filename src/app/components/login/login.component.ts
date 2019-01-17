import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IUserLogin } from 'src/app/services/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError = '';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['',  Validators.required],
    });
  }

  async login(submittedForm: FormGroup) {
    this.authService
      .authorize(<IUserLogin>{ username: submittedForm.value.login, password: submittedForm.value.password })
      .subscribe(authStatus => {
        this.router.navigate(['sittingplacesmen']);
      }, error => this.loginError = 'Неверный логин или пароль');
  }
}
