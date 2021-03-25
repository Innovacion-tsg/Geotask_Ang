import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent} from './login/login.component';
import { StartComponent} from './start/start.component';
import { HomeComponent} from './home/home.component';
import { NotFoundComponent} from './not-found/not-found.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch:'full'},
  {path: 'login', component: LoginComponent},
  {path: 'start', component: StartComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
      path: 'home',
      component: HomeComponent
    }
    ]
  },
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
