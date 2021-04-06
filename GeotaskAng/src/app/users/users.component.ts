import { Component, OnInit ,AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import{ GlobalConstants } from '../global-constants';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
interface companiesObj{
  idcompany: Int16Array;
  company: String;
  idcompany_type: Int16Array;
  is_active: Boolean;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})


export class UsersComponent implements OnInit {
  

  options = [
    {
      name: "Crear",
      description: "Crear usuario o verificar si ya existe en la plataforma",
      options: [
        {
          name: "Crear",
          icono: "add_circle"
        },{
          name: "Verificar",
          icono: "verified"
        }
      ]
    },{
      name: "Editar",
      description: "Editar un usuario",
      options: [
        {
          name: "Editar",
          icono: "edit"
        }
      ]
    },{
      name: "Eliminar",
      description: "Eliminar un usuario o ver historial de eliminaciones",
      options: [
        {
          name: "Eliminar",
          icono: "person_remove"
        },{
          name: "Historial",
          icono: "history"
        }
      ]
    },{
      name: "Cuadrilla",
      description: "Crear cuadrilla, modificarla y verificarla",
      options: [
        {
          name: "Crear",
          icono: "group_add"
        },{
          name: "Modificar",
          icono: "engineering"
        },{
          name: "Verificar",
          icono: "admin_panel_settings"
        }
      ]
    }
  ];
  users;
  roles;
  companies: companiesObj[] = [];
  eps: companiesObj[] = [];
  arl: companiesObj[] = [];
  it;
  specialties;
  selectedValue: string;
  isLoading=false;
  displayedColumns: string[] = ['iduser','first_name','last_name','email','role','is_active','button'];
  dataSource;
  formCreate=false;
  formEdit=false;
  formDelete=false;
  form: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private http: HttpClient,private formBuilder: FormBuilder) {
  
  }

  ngOnInit(): void {
    this.isLoading=true;
    this.http.get('http://'+GlobalConstants.report_server_address+'/users', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.users=response;
      this.dataSource=new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/roles', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.roles=response;
    });
    let companies;
    this.http.get('http://'+GlobalConstants.report_server_address+'/companies', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      companies=response;
      for(let obj of companies){
        let a=obj;
        switch(obj.idcompany_type){
          case(1):
            this.companies.push(obj);
            break;
          case(2):
            this.eps.push(obj);
            break;
          case(3):
            this.arl.push(obj);
            break;
        }
      }
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/identifications_types', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.it=response;
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/specialties', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.specialties=response;
    });
    this.buildForm();
    this.isLoading=false;
  }

  buildForm(){
    this.form = this.formBuilder.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      idrole: [null, [Validators.required]],
      ididentification_type: [null, null],
      identification: [null, null],
      phone: [null, null],
      idspecialty:[null, null],
      idcompany:[null, null],
      ideps:[null, null],
      idarl:[null, null]
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  EditUser(id){

  }

  DeleteUser(user): void{
    let u=user;
    const index: number = this.users.indexOf(u);
    let delet;
    if(index !== -1){
      delet=this.users[index];
    }
    this.http.get('http://'+GlobalConstants.report_server_address+'/users/delete', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'})
      ,
      params: new HttpParams().set("id",delet.iduser)
    }).subscribe(response => {
      debugger;
      let u=response;
      this.users[index].is_active=false;
      this.dataSource=new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  toggleCreate(){
    if (this.formCreate) {
      this.formCreate = false;
    } else {
      this.formCreate = true;
    }
  }

  onSubmit(event) {
    event.preventDefault();
    debugger;
    let info=this.form.value;
    info.idrole=parseInt(info.idrole);
    if (this.form.valid) {
      this.http.post('http://'+GlobalConstants.report_server_address+'/users', info,{
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        responseType: 'text' as 'json'
      }).subscribe(response => {
        debugger;
        let a=response;
      });
    }
  }
}
