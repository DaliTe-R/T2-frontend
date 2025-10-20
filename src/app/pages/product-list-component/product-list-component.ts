import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router'; // ✅ ActivatedRoute agregado
import { Product } from '../../model/product';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list-component.html',
  styleUrls: ['./product-list-component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute // ✅ ACTIVATEDROUTE AGREGADO
  ) {}

  ngOnInit(): void {
    console.log('✅ Componente ProductList iniciado');
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('✅ Productos cargados:', this.products.length);
      },
      error: (error) => {
        console.error('❌ Error loading products', error);
        alert('Error al cargar los productos');
      }
    });
  }

  editProduct(id: number): void {
    this.router.navigate(['edit', id], { relativeTo: this.route }); // ✅ CORREGIDO
  }

  deleteProduct(id: number): void {
    const product = this.products.find(p => p.idProduct === id);
    const productName = product?.name || 'este producto';

    if (confirm(`¿Está seguro de que desea eliminar el producto "${productName}"?`)) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.idProduct !== id);
          alert('Producto eliminado correctamente');
        },
        error: (error) => {
          console.error('Error deleting product', error);
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
      return 'stock-out';
    } else if (this.isLowStock(stock)) {
      return 'stock-low';
    }
    return 'stock-normal';
  }

  getDateBadgeClass(expired: string): string {
    if (this.isExpired(expired)) {
      return 'date-expired';
    } else if (this.isExpiringSoon(expired)) {
      return 'date-expiring';
    }
    return 'date-normal';
  }
}