// src/app/model/family.ts
export class Family {
    idFamily: number;
    name: string;
    description: string;
    active: boolean;

    constructor() {
        this.idFamily = 0;
        this.name = '';
        this.description = '';
        this.active = true;
    }
}