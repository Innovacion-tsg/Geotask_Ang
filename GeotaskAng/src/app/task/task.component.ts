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
      this.stations=response;
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
    this.dataSource=new MatTableDataSource(this.stations);
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
      iddevice: [null, [Validators.required]]
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
    this.stations.forEach(element => {
      if(element.idtask == idtask){
        a=element;
      }
    });
    return a;
  }
  
  onSubmit(event) {
    event.preventDefault();
    debugger;
    let info=this.form.value;
    info['idstatus']=1;
    info['estimated_date']=null;
    info['creation_date']=null;
    info['finish_date']=null;
    info.idtask_type= parseInt(info.idtask_type);
    info.iduser= parseInt(info.iduser);
    info.idpriority= parseInt(info.idpriority);
    info.idstation= parseInt(info.idstation);
    info.iddevice= parseInt(info.iddevice);
    if(this.form.valid){
      if (this.isAdd) {
        this.http.post('http://'+GlobalConstants.report_server_address+'/tasks', info,{
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'json'
        }).subscribe(response => {
          let value : any = response;
          this.tasks.push(value);
          this.UpdateTable();
          this.clearMe();
        });
      }else{
        let s=this.findTask(this.element.idtask);
        let index: number = this.tasks.indexOf(s);
        info['idtask']=this.element.idtask;
        this.http.put('http://'+GlobalConstants.report_server_address+'/tasks', info,{
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'text' as 'json'
          }).subscribe(response => {
            this.tasks[index].description=info.desciption;
            this.tasks[index].idtask_type=info.idtask_type;
            this.tasks[index].iduser=info.iduser;
            this.tasks[index].idpriority=info.idpriority;
            this.tasks[index].idstation=info.idstation;
            this.tasks[index].iddevice=info.iddevice;
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
      iddevice: element.iddevice.toString()
    });
  }
}
