import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements OnInit {


  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }
  
  go(op){
    switch(op){
      case 1:
        this.router.navigate(['/users']);
        break;
      case 2:
        this.router.navigate(['/stations']);
        break;
      case 3:
        this.router.navigate(['/companies']);
        break;
      case 4:
        this.router.navigate(['/task']);
        break;
      case 5:
        this.router.navigate(['/home']);
        break;
      default:
        break;
    }
  }

}
