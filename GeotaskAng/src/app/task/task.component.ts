import { Component, OnInit ,AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import{ GlobalConstants } from '../global-constants';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  displayedColumns: string[] = ['idtask','description','task_type','user','priority','station','device','status','button'];
  dataSource;
  form: FormGroup;
  tasks;
  tasks_types;
  users;
  priorities;
  stations;
  devices;
  statuses;
  isAdd=true;
  isLoading=false;
  formCreate=false;
  element;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private http: HttpClient,private formBuilder: FormBuilder) {
  
  }

  ngOnInit(): void {
    this.isLoading=true;
    
    this.http.get('http://'+GlobalConstants.report_server_address+'/tasks', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.tasks=response;
      this.UpdateTable();
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/tasks_types', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.tasks_types=response;
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/users', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.users=response;
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/priorities', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.priorities=response;
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/stations', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.stations=response;
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/devices', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.devices=response;
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/statuses', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.statuses=response;
    });
    
    this.buildForm();
    this.isLoading=false;
  }


  UpdateTable(){
    this.dataSource=new MatTableDataSource(this.tasks);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  buildForm(){
    this.form = this.formBuilder.group({
      description: [null, [Validators.required]],
      idtask_type: [null, [Validators.required]],
      iduser: [null,[Validators.required]],
      idpriority: [null, [Validators.required]],
      idstation: [null, [Validators.required]],
      iddevice: [null, [Validators.required]],
      estimated_date: [null, [Validators.required]]
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearMe(): void {
    this.form.reset();
    Object.keys(this.form.controls).forEach(key =>{
       this.form.controls[key].setErrors(null)
    });
  }

  toggleCreate(){
    if (this.formCreate) {
      this.formCreate = false;
      this.isAdd = false;
    } else {
      this.formCreate = true;
      this.isAdd= true;
      this.element=null;
    }
    this.clearMe();
  }
 
  findTask(idtask): any{
    let a=null;
    this.tasks.forEach(element => {
      if(element.idtask == idtask){
        a=element;
      }
    });
    return a;
  }
  
  onSubmit(event) {
    event.preventDefault();
    let info=this.form.value;
    info['creation_date']=info.estimated_date;
    info['finish_date']=null;
    info.idtask_type= parseInt(info.idtask_type);
    info.iduser= parseInt(info.iduser);
    info.idpriority= parseInt(info.idpriority);
    info.idstation= parseInt(info.idstation);
    info.iddevice= parseInt(info.iddevice);
    if(this.form.valid){
      if (this.isAdd) {
        info['idstatus']=1;
        info['is_active']=true;
        this.http.post('http://'+GlobalConstants.report_server_address+'/tasks', info,{
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'json'
        }).subscribe(response => {
          debugger;
          let value : any = response;
          value.status=this.searchAny(info.idstatus,"status");
          value.task_type=this.searchAny(info.idtask_type,"task_type");
          value.user=this.searchAny(info.iduser,"user");
          value.priority=this.searchAny(info.idpriority,"priority");
          value.station=this.searchAny(info.idstation,"station");
          value.device=this.searchAny(info.iddevice,"device");
          this.tasks.push(value);
          this.UpdateTable();
          this.clearMe();
        });
      }else{
        let s=this.findTask(this.element.idtask);
        let index: number = this.tasks.indexOf(s);
        info['idtask']=this.element.idtask;
        info['idstatus']=parseInt(this.element.idstatus);
        info['is_active']=this.element.is_active;
        this.http.put('http://'+GlobalConstants.report_server_address+'/tasks', info,{
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'text' as 'json'
          }).subscribe(response => {
            this.tasks[index].description=info.description;
            this.tasks[index].creation_date=info.creation_date;
            this.tasks[index].estimated_date=info.estimated_date;
            this.tasks[index].idtask_type=info.idtask_type.toString();
            this.tasks[index].task_type=this.searchAny(info.idtask_type,"task_type");
            this.tasks[index].iduser=info.iduser.toString();
            this.tasks[index].user=this.searchAny(info.iduser,"user");
            this.tasks[index].idpriority=info.idpriority.toString();
            this.tasks[index].priority=this.searchAny(info.idpriority,"priority");
            this.tasks[index].idstation=info.idstation.toString();
            this.tasks[index].station=this.searchAny(info.idstation,"station");
            this.tasks[index].iddevice=info.iddevice.toString();
            this.tasks[index].device=this.searchAny(info.iddevice,"device");
            this.tasks[index].idstatus=info.idstatus.toString();
            this.tasks[index].status=this.searchAny(info.idstatus,"status");
            this.UpdateTable();
          });
        this.clearMe();
      }
    }
  }


  DeleteStation(task): void{
    
  }

  EditTask(element){
    if(this.formCreate){
      this.toggleCreate();
    }
    this.toggleCreate();
    this.isAdd=false;
    this.element=element;
    this.form.setValue({
      description: element.description,
      idtask_type: element.idtask_type.toString(),
      iduser: element.iduser.toString(),
      idpriority: element.idpriority.toString(),
      idstation: element.idstation.toString(),
      iddevice: element.iddevice.toString(),
      estimated_date: element.estimated_date
    });
  }

  searchAny(id,type){
    let a;
    switch(type){
      case "task_type":
        this.tasks_types.forEach(element => {
          if(element.idtask_type==id){
            a=element.task_type;
          }
        });
        break;
      case "user":
        this.users.forEach(element => {
          if(element.iduser==id){
            a=element.email;
          }
        });
        break;
      case "priority":
        this.priorities.forEach(element => {
          if(element.idpriority==id){
            a=element.priority;
          }
        });
        break;
      case "station":
        this.stations.forEach(element => {
          if(element.idstation==id){
            a=element.station;
          }
        });
        break;
      case "device":
        this.devices.forEach(element => {
          if(element.iddevice==id){
            a=element.device;
          }
        });
        break;
      case "status":
        this.statuses.forEach(element => {
          if(element.idstatus==id){
            a=element.status;
          }
        });
        break;
      default:
        break;
    }
    return a;
  }
}
