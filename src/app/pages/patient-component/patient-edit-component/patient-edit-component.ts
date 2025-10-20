import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Patient } from '../../../model/patient';
import { PatientService } from '../../../services/patient-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-patient-edit-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './patient-edit-component.html',
  styleUrl: './patient-edit-component.css'
})
export class PatientEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    
    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initializeForm() {
    this.form = new FormGroup({
      idPatient: new FormControl(0),
      dni: new FormControl('', [
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern('^[0-9]*$')
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(70),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(70),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.maxLength(9),
        Validators.pattern('^[0-9]*$')
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(60),
        Validators.email
      ]),
      address: new FormControl('', [
        Validators.maxLength(150)
      ])
    });
  }

  initForm() {
    if (this.isEdit) {
      this.patientService.findById(this.id).subscribe((data) => {
        this.form.patchValue({
          idPatient: data.idPatient,
          firstName: data.firstName,
          lastName: data.lastName,
          dni: data.dni,
          address: data.address,
          phone: data.phone,
          email: data.email,
        });
      });
    }
  }

  // Validar datos antes de enviar
  validatePatientData(patient: Patient): boolean {
    const errors: string[] = [];

    if (patient.firstName.length > 70) {
      errors.push('El nombre no puede tener más de 70 caracteres');
    }

    if (patient.lastName.length > 70) {
      errors.push('El apellido no puede tener más de 70 caracteres');
    }

    if (patient.dni.length > 8) {
      errors.push('El DNI no puede tener más de 8 caracteres');
    }

    if (patient.phone.length > 9) {
      errors.push('El teléfono no puede tener más de 9 caracteres');
    }

    if (patient.email.length > 60) {
      errors.push('El email no puede tener más de 60 caracteres');
    }

    if (patient.address && patient.address.length > 150) {
      errors.push('La dirección no puede tener más de 150 caracteres');
    }

    if (errors.length > 0) {
      this.showError(errors.join(', '));
      return false;
    }

    return true;
  }

  persist() {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      this.showError('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    const patient: Patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.dni = this.form.value['dni'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];
    patient.address = this.form.value['address'];

    // Validar longitud de datos
    if (!this.validatePatientData(patient)) {
      return;
    }

    if (this.isEdit) {
      // EDIT
      this.patientService.update(this.id, patient).subscribe({
        next: () => {
          this.patientService.findAll().subscribe(data => {
            this.patientService.setPatientChange(data);
            this.patientService.setMessageChange('UPDATED!');
            this.showSuccess('Paciente actualizado correctamente');
            this.router.navigate(['/pages/patient']);
          });
        },
        error: (error) => {
          console.error('Error updating patient:', error);
          this.handleError(error);
        }
      });
    } else {
      // SAVE
      this.patientService.save(patient)
        .pipe(switchMap(() => this.patientService.findAll()))
        .subscribe({
          next: (data) => {
            this.patientService.setPatientChange(data);
            this.patientService.setMessageChange('CREATED!');
            this.showSuccess('Paciente creado correctamente');
            this.router.navigate(['/pages/patient']);
          },
          error: (error) => {
            console.error('Error saving patient:', error);
            this.handleError(error);
          }
        });
    }
  }

  // Marcar todos los campos como touched para mostrar errores
  markFormGroupTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control.markAsTouched();
    });
  }

  // Manejar errores del servidor
  handleError(error: any) {
    let errorMessage = 'Error al guardar el paciente';
    
    if (error.error && error.error.message) {
      if (error.error.message.includes('Data truncation')) {
        errorMessage = 'Error: Algunos datos exceden la longitud permitida';
      } else {
        errorMessage = error.error.message;
      }
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor. Por favor, verifique los datos.';
    }
    
    this.showError(errorMessage);
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get dni() { return this.form.get('dni'); }
  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }
  get phone() { return this.form.get('phone'); }
  get email() { return this.form.get('email'); }
  get address() { return this.form.get('address'); }
}
