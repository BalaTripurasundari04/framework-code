import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj: any = {
    "employee_email": "",
    "password": "", 
  };
  loginError: string = ""; 
  
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ){}
  


  onLogin() {

    
    
    this.http.post('http://localhost:8080/api/login', this.loginObj,{withCredentials:true}).subscribe((res:any)=>{
      if(res.result) {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.loginError = res.message;
      }
        
      
      
    },
    
    )
  }

  }