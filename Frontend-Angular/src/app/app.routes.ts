import { Routes } from '@angular/router';   
import { LoginComponent } from './components/actor/login/login.component';
import { HomeComponent } from './components/layout/home/home.component';
import { FormAdministradorComponent } from './components/administrador/form-administrador/form-administrador.component';
import { FormProfesorComponent } from './components/profesor/form-profesor/form-profesor.component';
import { FormAlumnoComponent } from './components/alumno/form-alumno/form-alumno.component';
import { FormCriterioComponent } from './components/criterio/form-criterio/form-criterio.component';
import { FormRubricaComponent } from './components/rubrica/form-rubrica/form-rubrica.component';
import { ListAlumnoComponent } from './components/alumno/list-alumno/list-alumno.component';
import { ListProfesorComponent } from './components/profesor/list-profesor/list-profesor.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path: "login", component: LoginComponent},

    // ADMINISTRADOR
    {path: "administrador/registro", component: FormAdministradorComponent},
    {path: "administrador/editar", component: FormAdministradorComponent},

    // PROFESOR
    {path: "profesor/registro", component: FormProfesorComponent},
    {path: "profesor/editar", component: FormProfesorComponent},
    {path: "profesores", component: ListProfesorComponent},

    // ALUMNO
    {path: "alumno/registro", component: FormAlumnoComponent},
    {path: "alumno/editar", component: FormAlumnoComponent},
    {path: "alumno/editar/:id", component: FormAlumnoComponent},
    {path: "alumnos", component: ListAlumnoComponent},

    // CRITERIO
    {path: "criterio/nuevo", component: FormCriterioComponent},
    {path: "criterio/editar/:id", component: FormCriterioComponent},

    // RUBRICA
    {path: "rubrica/nueva", component: FormRubricaComponent},
    {path: "rubrica/editar/:id", component: FormRubricaComponent}

];
