import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category, Family, Laboratory } from '../model/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string = `${environment.HOST}/api/products`;

  constructor(private http: HttpClient) { }

  // CRUD Operations para Productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.HOST}/api/categories`);
  }

  getFamilies(): Observable<Family[]> {
    return this.http.get<Family[]>(`${environment.HOST}/api/families`);
  }

  getLaboratories(): Observable<Laboratory[]> {
    return this.http.get<Laboratory[]>(`${environment.HOST}/api/laboratories`);
  }
}