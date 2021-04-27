import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuarioOlvidado: boolean;
  form: FormGroup;
  formForgot: FormGroup;
  isLoading = false;
  invalidLogin;

  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(){
    this.form = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    this.formForgot = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  get user() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
  get email() { return this.formForgot.get('email'); }

  getErrorUser() {
    return this.user.hasError('required') ? 'Este campo es requerido' : '';
  }

  getErrorPassword() {
    return this.password.hasError('required') ? 'Este campo es requerido' : '';
  }

  getErrorForgotEmail() {
    return this.email.hasError('required') ? 'Este campo es requerido' :
      this.email.hasError('email') ? 'No es un Email valido' :
        '';
  }

  onSubmit(event) {
    event.preventDefault();

    if (this.form.valid) {
      
      this.login();
    }
  }

  onRemember(event) {
    event.preventDefault();

    if (this.formForgot.valid) {
      
      this.login();
    }
  }

  login() {
    let cred = this.form.value;
    this.isLoading = true;
    localStorage.clear();
    cred= JSON.stringify(cred);
    localStorage.setItem('user', cred);
    this.router.navigate(['/start']);
    this.isLoading = false;
  }
}
