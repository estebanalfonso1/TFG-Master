import { Criterio } from "./Criterio";
import { Profesor } from "./Profesor";
import { Tribunal } from "./Tribunal";

export class Valoracion {
    id!: number;
    profesor: Profesor;
    tribunal: Tribunal;
    criterio: Criterio;
    valoracion: number;

    constructor(profesor: Profesor, tribunal: Tribunal, criterio: Criterio, valoracion: number,
    ) {
        this.profesor = profesor;
        this.tribunal = tribunal;
        this.criterio = criterio;
        this.valoracion = valoracion;
    }
}