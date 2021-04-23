import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent} from './login/login.component';
import { StartComponent} from './start/start.component';
import { HomeComponent} from './home/home.component';
import { NotFoundComponent} from './not-found/not-found.component';
import { TaskComponent} from './task/task.component';
import { UsersComponent} from './users/users.component';
import { ReportComponent} from './report/report.component';
import { StationsComponent } from './stations/stations.component';
import { CompaniesComponent } from './companies/companies.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch:'full'},
  {path: 'login', component: LoginComponent},
  {path: 'start', component: StartComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: 'task',
      component: TaskComponent
    },
    {
      path: 'users',
      component: UsersComponent
    },
    {
      path: 'report',
      component: ReportComponent
    },
    {
      path: 'stations',
      component: StationsComponent
    },
    {
      path: 'companies',
      component: CompaniesComponent
    }
  ]},
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
