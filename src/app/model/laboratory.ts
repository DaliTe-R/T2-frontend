// src/app/model/laboratory.ts
export class Laboratory {
    idLaboratory: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    active: boolean;

    constructor() {
        this.idLaboratory = 0;
        this.name = '';
        this.description = '';
        this.address = '';
        this.phone = '';
        this.email = '';
        this.active = true;
    }
}