import { Routes } from '@angular/router';
import { PatientComponent } from './pages/patient-component/patient-component';
import { PatientEditComponent } from './pages/patient-component/patient-edit-component/patient-edit-component';
import { MedicComponent } from './pages/medic-component/medic-component';
import { ProductListComponent } from './pages/product-list-component/product-list-component';
import { ProductFormComponent } from './pages/product-form-component/product-form-component';

export const routes: Routes = [
    // Ruta por defecto
    { path: '', redirectTo: '/pages/products', pathMatch: 'full' },
    
    // Rutas de pacientes
    { 
        path: 'pages/patient', 
        component: PatientComponent,
        children: [
            { path: 'new', component: PatientEditComponent },
            { path: 'edit/:id', component: PatientEditComponent },
        ]
    },
    
    // Rutas de médicos
    { 
        path: 'pages/medic', 
        component: MedicComponent 
    },

     { 
    path: 'pages/products', 
    component: ProductListComponent 
    },
     { 
    path: 'pages/products/new', 
    component: ProductFormComponent 
     },
    { 
    path: 'pages/products/edit/:id', 
    component: ProductFormComponent 
    },
  
  // Ruta comodín
  { path: '**', redirectTo: '/pages/products' }
    // Rutas de productos - CON RUTAS HIJA CORRECTAS
    
];
    
    
