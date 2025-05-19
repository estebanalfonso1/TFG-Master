import { Alumno } from "./Alumno";
import { Profesor } from "./Profesor";
import { Rubrica } from "./Rubrica";

export class Tribunal {
    id!: number;
    fechaEntrega: Date;
    fechaFin: Date;
    estado: string;
    archivo: string | null;
    tieneProfesores: Set<Profesor>;
    alumno: Alumno;
    rubrica: Rubrica;
    nombre: string;

    constructor(fechaEntrega: Date, fechaFin: Date, estado: string, archivo: string,
        tieneProfesores: Set<Profesor>, alumno: Alumno, rubrica: Rubrica, nombre: string
    ) {
        this.fechaEntrega = fechaEntrega;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.archivo = archivo;
        this.tieneProfesores = tieneProfesores;
        this.alumno = alumno;
        this.rubrica = rubrica;
        this.nombre = nombre;
    }
}