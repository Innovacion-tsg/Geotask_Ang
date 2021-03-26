import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  options = [
    {
      name: "Asignar",
      description: "Asignar, editar o eliminar una tarea a un tecnico",
      options: [
        {
          name: "Crear",
          icono: "add_circle"
        },{
          name: "Editar",
          icono: "edit_note"
        },{
          name: "Eliminar",
          icono: "delete"
        }
      ]
    },{
      name: "Editar tareas",
      description: "Permite crear, editar o eliminar un tipo de tarea",
      options: [
        {
          name: "Crear",
          icono: "add_task"
        },{
          name: "Editar",
          icono: "format_list_numbered"
        },{
          name: "Eliminar",
          icono: "delete_outline"
        }
      ]
    },{
      name: "Ver progreso de tareas",
      description: "Permite observar el progreso de la tarea",
      options: [
        {
          name: "Ver progreso",
          icono: "date_range"
        },{
          name: "Finalizadas",
          icono: "done_all"
        }
      ]
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
