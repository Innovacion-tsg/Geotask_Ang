import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private statusSource = new BehaviorSubject(true);

  currentStatus = this.statusSource.asObservable();

  constructor() { }

  changeStatus(localStatus: boolean) {
    this.statusSource.next(localStatus);
  }
}
