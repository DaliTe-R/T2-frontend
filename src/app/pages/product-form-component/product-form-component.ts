import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { Product, Category, Family, Laboratory } from '../../model/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-form-component.html',
  styleUrls: ['./product-form-component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  families: Family[] = [];
  laboratories: Laboratory[] = [];
  isEdit = false;
  productId?: number;

  // ✅ GETTERS AGREGADOS
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get presentation() { return this.productForm.get('presentation'); }
  get unitPrice() { return this.productForm.get('unitPrice'); }
  get stock() { return this.productForm.get('stock'); }
  get expired() { return this.productForm.get('expired'); }
  get category() { return this.productForm.get('category'); }
  get family() { return this.productForm.get('family'); }
  get laboratory() { return this.productForm.get('laboratory'); }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadDropdownData();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      presentation: ['', [Validators.required]],
      unitPrice: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      expired: ['', [Validators.required]],
      category: ['', [Validators.required]],
      family: ['', [Validators.required]],
      laboratory: ['', [Validators.required]]
    });
  }

  loadDropdownData(): void {
    this.productService.getCategories().subscribe(data => this.categories = data);
    this.productService.getFamilies().subscribe(data => this.families = data);
    this.productService.getLaboratories().subscribe(data => this.laboratories = data);
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          presentation: product.presentation,
          unitPrice: product.unitPrice,
          stock: product.stock,
          expired: product.expired.split('T')[0],
          category: product.category.idCategory,
          family: product.family.idFamily,
          laboratory: product.laboratory.idLaboratory
        });
      },
      error: (error) => {
        console.error('Error loading product', error);
        alert('Error al cargar el producto');
      }
    });
  }

  // ✅ MÉTODO GETERROR MESSAGE AGREGADO
  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }
    
    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres requeridos`;
    }
    
    if (control.hasError('min')) {
      const minValue = control.errors['min'].min;
      return `El valor mínimo permitido es ${minValue}`;
    }
    
    return 'Campo inválido';
  }

  onSubmit(): void {
    // ✅ MARCADO DE CAMPOS TOUCHED AGREGADO
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      const formData = this.productForm.value;
      
      const category = this.categories.find(c => c.idCategory === +formData.category);
      const family = this.families.find(f => f.idFamily === +formData.family);
      const laboratory = this.laboratories.find(l => l.idLaboratory === +formData.laboratory);

      const product: Product = {
        name: formData.name,
        description: formData.description,
        presentation: formData.presentation,
        unitPrice: formData.unitPrice,
        stock: formData.stock,
        expired: formData.expired,
        category: category!,
        family: family!,
        laboratory: laboratory!
      };

      if (this.isEdit && this.productId) {
        this.productService.updateProduct(this.productId, product).subscribe({
          next: () => {
            alert('Producto actualizado correctamente');
            this.router.navigate(['/pages/products']);
          },
          error: (error) => {
            console.error('Error updating product', error);
            alert('Error al actualizar el producto');
          }
        });
      } else {
        this.productService.createProduct(product).subscribe({
          next: () => {
            alert('Producto creado correctamente');
            this.router.navigate(['/pages/products']);
          },
          error: (error) => {
            console.error('Error creating product', error);
            alert('Error al crear el producto');
          }
        });
      }
    } else {
      alert('Por favor, complete todos los campos requeridos correctamente');
    }
  }

  // ✅ MÉTODO ONCANCEL AGREGADO
  onCancel(): void {
    this.router.navigate(['/pages/products']);
  }
}