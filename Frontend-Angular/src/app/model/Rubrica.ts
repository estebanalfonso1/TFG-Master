import { Criterio } from "./Criterio";
import { Profesor } from "./Profesor";

export class Rubrica {
    id!: number;
    descripcion: string;
    fechaPublicacion: Date;
    profesor: Profesor;
    criterios: Set<Criterio>;

    constructor(descripcion: string, fechaPublicacion: Date, profesor: Profesor, criterios: Set<Criterio>
    ) {
        this.descripcion = descripcion,
            this.fechaPublicacion = fechaPublicacion,
            this.profesor = profesor,
            this.criterios = criterios
    }
}