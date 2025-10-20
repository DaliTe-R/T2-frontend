import { Routes } from '@angular/router';
import { PatientComponent } from './pages/patient-component/patient-component';
import { PatientEditComponent } from './pages/patient-component/patient-edit-component/patient-edit-component';
import { MedicComponent } from './pages/medic-component/medic-component';

export const routes: Routes = [
    { path: 'pages/patient', component: PatientComponent,
        children: [
            { path: 'new', component: PatientEditComponent },
            { path: 'edit/:id', component: PatientEditComponent }
        ]
    },
    { path: 'pages/medic', component: MedicComponent }
];
