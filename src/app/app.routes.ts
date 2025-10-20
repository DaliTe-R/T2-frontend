import { Routes } from '@angular/router';
import { PatientComponent } from './pages/patient-component/patient-component';
import { PatientEditComponent } from './pages/patient-component/patient-edit-component/patient-edit-component';
import { MedicComponent } from './pages/medic-component/medic-component';
import { ProductListComponent } from './pages/product-list-component/product-list-component';
import { ProductFormComponent } from './pages/product-form-component/product-form-component';

export const routes: Routes = [
    { path: 'pages/patient', component: PatientComponent,
        children: [
            { path: 'new', component: PatientEditComponent },
            { path: 'edit/:id', component: PatientEditComponent },
            
        ]
    },
    { path: 'pages/medic', component: MedicComponent },
    { path: 'pages/products', component: ProductListComponent,
    children: [
        { path: 'new', component: ProductFormComponent },
        { path: 'edit/:id', component: ProductFormComponent }
    ]
}
];

