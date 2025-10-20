// src/app/model/product.ts
export interface Product {
  idProduct?: number;
  name: string;
  description: string;
  presentation: string;
  unitPrice: number;
  stock: number;
  expired: string; 
  category: Category;
  family: Family;
  laboratory: Laboratory;
}

export interface Category {
  idCategory: number;
  name: string;
  description: string;
}

export interface Family {
  idFamily: number;
  name: string;
  description: string;
}

export interface Laboratory {
  idLaboratory: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}