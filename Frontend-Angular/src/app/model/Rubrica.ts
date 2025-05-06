import { Criterio } from "./Criterio";
import { Profesor } from "./Profesor";

export class Rubrica {
    id!: number;
    descripcion: string;
    esBorrador: boolean;
    fechaPublicacion: Date;
    criterios: Set<Criterio>;

    constructor(descripcion: string, esBorrador: boolean, fechaPublicacion: Date, criterios: Set<Criterio>
    ) {
        this.descripcion = descripcion,
            this.esBorrador = esBorrador,
            this.fechaPublicacion = fechaPublicacion,
            this.criterios = criterios
    }
}