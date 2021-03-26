import { Component, OnInit } from '@angular/core';

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
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
