import { Alumno } from "./Alumno";
import { Profesor } from "./Profesor";
import { Rubrica } from "./Rubrica";

export class Tribunal {
    id!: number;
    fechaEntrega: Date;
    fechaFin: Date;
    estado: string;
    archivo: string;
    comentario: string;
    tieneProfesores: Set<Profesor>;
    alumno: Alumno;
    rubricas: Set<Rubrica>;

    constructor(fechaEntrega: Date, fechaFin: Date, estado: string, archivo: string,
        comentario: string, tieneProfesores: Set<Profesor>, alumno: Alumno, rubricas: Set<Rubrica>
    ) {
        this.fechaEntrega = fechaEntrega;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.archivo = archivo;
        this.comentario = comentario;
        this.tieneProfesores = tieneProfesores;
        this.alumno = alumno;
        this.rubricas = rubricas;

    }
}