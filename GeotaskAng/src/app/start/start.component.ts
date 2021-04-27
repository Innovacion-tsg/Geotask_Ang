import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { StatusService } from '../start/status.service';
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  opened: boolean;
  isLoading = false;
  isLoading2 = false;
  user;
  private subscription: Subscription;

  constructor(private router: Router, private http: HttpClient, private status: StatusService) { }

  ngOnInit(): void {
    if (localStorage.getItem('user')){
      debugger;
      this.user =JSON.parse(localStorage.getItem('user'));
    }else{
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.navigationWasClosed();
  }
  navigationWasClosed(): void {
    this.status.changeStatus(false);
  }
  ordenarSmartboxList(){

  }
  getSmartboxListFromStations() {
    
  }
  isUndefined(value){
    var undefined = void(0);
    return value === undefined;
  }
  logOut(): void {
      this.router.navigate(['/login']);
      localStorage.removeItem('user');
      this.isLoading = false;
  }

}
