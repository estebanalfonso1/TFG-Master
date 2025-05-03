import { Actor } from "./Actor";
import { Rol } from "./Rol";

export class Alumno extends Actor {

    calificacionTotal: number;
    curso: string;

    constructor(
        id: number,
        nombre: string,
        apellido1: string,
        apellido2: string,
        email: string,
        foto: string,
        telefono: string,
        direccion: string,
        username: string,
        password: string,
        rol: Rol,
        calificacionTotal: number,
        curso: string
    ) {
        super(id, nombre, apellido1, apellido2, email, foto, telefono, direccion, username, password, rol);
        this.calificacionTotal = calificacionTotal;
        this.curso = curso;
    }

}