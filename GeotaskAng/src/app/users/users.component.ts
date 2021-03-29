import { Component, OnInit ,AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
const users=[
  {
    iduser:"1",
    email:"esther.ochoa@tsg.net.co",
    first_name:"Esther",
    last_name:"Ochoa",
    idrole:"1"
  },
  {
    iduser:"2",
    email:"edwin.castillo@tsg.net.co",
    first_name:"Edwin",
    last_name:"Castillo",
    idrole:"1"
  },
  {
    iduser:"3",
    email:"pablo.fernandez@tsg.net.co",
    first_name:"Pablo",
    last_name:"Fernandez",
    idrole:"3"
  },
  {
    iduser:"4",
    email:"innovacion@tsg.net.co",
    first_name:"Oscar",
    last_name:"Romero",
    idrole:"2"
  },
  {
    iduser:"5",
    email:"hernan.gomez@tsg.net.co",
    first_name:"Hernan",
    last_name:"Gomez",
    idrole:"3"
  },
  {
    iduser:"6",
    email:"hernan.gomez@tsg.net.co",
    first_name:"Gomez",
    last_name:"Hernan",
    idrole:"3"
  }
];
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


  displayedColumns: string[] = ['iduser','first_name','last_name','email','idrole'];
  dataSource=new MatTableDataSource(users);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor() { 
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
