import { Routes } from '@angular/router';   
import { LoginComponent } from './components/actor/login/login.component';
import { HomeComponent } from './components/layout/home/home.component';
import { FormAdministradorComponent } from './components/administrador/form-administrador/form-administrador.component';
import { FormProfesorComponent } from './components/profesor/form-profesor/form-profesor.component';
import { FormAlumnoComponent } from './components/alumno/form-alumno/form-alumno.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path: "login", component: LoginComponent},
    {path: "administrador", component: FormAdministradorComponent},
    {path: "administrador/editar", component: FormAdministradorComponent},
    {path: "profesor", component: FormProfesorComponent},
    {path: "profesor/editar", component: FormProfesorComponent},
    {path: "alumno", component: FormAlumnoComponent},
    {path: "alumno/editar", component: FormAlumnoComponent},
    {path: "alumno/editar/:id", component: FormAlumnoComponent}

];
