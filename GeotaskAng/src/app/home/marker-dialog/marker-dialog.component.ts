import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-marker-dialog',
  templateUrl: './marker-dialog.component.html',
  styleUrls: ['./marker-dialog.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class MarkerDialogComponent implements OnInit {
  
  breakpoint: number;
  minimizedWindow = false;

  constructor(public dialogRef: MatDialogRef<MarkerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 811) ? 1 : 2;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 811) ? 1 : 2;
  }

  Close(): void {
    this.dialogRef.close();
  }

  minimizeWindow() {
    if (this.minimizedWindow) {
      this.minimizedWindow = false;
    } else if (this.minimizedWindow === false) {
      this.minimizedWindow = true;
    }
  }
}
