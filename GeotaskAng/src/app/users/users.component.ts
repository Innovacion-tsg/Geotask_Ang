import { Component, OnInit ,AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ GlobalConstants } from '../global-constants';

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
  isLoading=false;
  displayedColumns: string[] = ['iduser','first_name','last_name','email','idrole','button'];
  dataSource;
  formCreate=false;
  formEdit=false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private http: HttpClient) {
  
  }

  ngOnInit(): void {
    this.isLoading=true;
    this.http.get('http://'+GlobalConstants.report_server_address+'/users', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      //this.users=users;
      this.users=response;
      this.dataSource=new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
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
    if(index !== -1){
      this.users.splice(index,1);
    }
  }

  formVisible(type){
    switch(type){
      case "1":
        this.formCreate=!this.formCreate;
        break;
      case "2":
        this.formEdit=!this.formEdit;
        break;
      default:
        break;
    }
    if(type==="create"){
    }
  }
}
