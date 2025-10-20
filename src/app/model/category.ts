// src/app/model/category.ts
export class Category {
    idCategory: number;
    name: string;
    description: string;
    active: boolean;

    constructor() {
        this.idCategory = 0;
        this.name = '';
        this.description = '';
        this.active = true;
    }
}