import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list-component.html',
  styleUrls: ['./product-list-component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  products: Product[] = [];

  @ViewChild('newProductBtn') newProductBtn!: ElementRef;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('✅ Componente ProductList iniciado');
    this.loadProducts();
  }

  ngAfterViewInit() {
    console.log('🔍 Botón Nuevo Producto:', this.newProductBtn);
    console.log('📍 Ruta actual:', this.router.url);
    console.log('📍 Ruta destino esperada:', '/pages/products/new');
  }

  // ✅ MÉTODO MEJORADO PARA CREAR NUEVO PRODUCTO
  goToNewProduct(): void {
    console.log('🎯 Intentando navegar a nuevo producto...');
    
    // Opción 1: Ruta relativa
    this.router.navigate(['new'], { relativeTo: this.route }).then(success => {
      if (success) {
        console.log('✅ Navegación relativa exitosa');
      } else {
        // Fallback a ruta absoluta
        console.log('🔄 Intentando con ruta absoluta...');
        this.router.navigate(['/pages/products/new']).then(success2 => {
          console.log('✅ Navegación absoluta exitosa:', success2);
        }).catch(error2 => {
          console.error('❌ Error en navegación absoluta:', error2);
          alert('Error al navegar al formulario de producto');
        });
      }
    }).catch(error => {
      console.error('❌ Error en navegación relativa:', error);
      // Fallback a ruta absoluta
      this.router.navigate(['/pages/products/new']).then(success => {
        console.log('✅ Navegación absoluta exitosa (fallback):', success);
      });
    });
  }

  // ✅ MÉTODO ALTERNATIVO (puedes eliminar navigateToCreate si usas goToNewProduct)
  navigateToCreate(): void {
    console.log('🎯 Navegando a crear producto...');
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  loadProducts(): void {
    console.log('🔄 Cargando productos...');
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('✅ Productos cargados:', this.products.length);
        console.log('📦 Estructura del primer producto:', data[0]); // Para debug
      },
      error: (error) => {
        console.error('❌ Error loading products', error);
        alert('Error al cargar los productos');
      }
    });
  }

  editProduct(id: number): void {
    console.log('✏️ Editando producto ID:', id);
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  deleteProduct(id: number): void {
    const product = this.products.find(p => p.idProduct === id);
    const productName = product?.name || 'este producto';

    if (confirm(`¿Está seguro de que desea eliminar el producto "${productName}"?`)) {
      console.log('🗑️ Eliminando producto ID:', id);
      
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.idProduct !== id);
          console.log('✅ Producto eliminado');
          alert('Producto eliminado correctamente');
        },
        error: (error) => {
          console.error('❌ Error deleting product', error);
          alert('Error al eliminar el producto');
        }
      });
    }
  }

  // Métodos auxiliares para el template
  formatPrice(price: number): string {
    return `S/ ${price?.toFixed(2) || '0.00'}`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch {
      return '-';
    }
  }

  isLowStock(stock: number): boolean {
    return stock < 10;
  }

  isOutOfStock(stock: number): boolean {
    return stock === 0;
  }

  isExpiringSoon(expired: string): boolean {
    if (!expired) return false;
    try {
      const expiryDate = new Date(expired);
      const today = new Date();
      const daysDiff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return daysDiff <= 30 && daysDiff >= 0;
    } catch {
      return false;
    }
  }

  isExpired(expired: string): boolean {
    if (!expired) return false;
    try {
      const expiryDate = new Date(expired);
      const today = new Date();
      return expiryDate < today;
    } catch {
      return false;
    }
  }

  // Métodos para las clases CSS dinámicas
  getStockBadgeClass(stock: number): string {
    if (this.isOutOfStock(stock)) {
      return 'badge bg-danger';
    } else if (this.isLowStock(stock)) {
      return 'badge bg-warning text-dark';
    }
    return 'badge bg-success';
  }

  getDateBadgeClass(expired: string): string {
    if (this.isExpired(expired)) {
      return 'badge bg-danger';
    } else if (this.isExpiringSoon(expired)) {
      return 'badge bg-warning text-dark';
    }
    return 'badge bg-success';
  }
}