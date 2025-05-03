import { Actor } from "./Actor";
import { Rol } from "./Rol";

export class Administrador extends Actor {

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
        rol: Rol
    ) {
        super(id, nombre, apellido1, apellido2, email, foto, telefono, direccion, username, password, rol)
    }

}