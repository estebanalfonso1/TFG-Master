import { Rol } from "./Rol";

export class Actor {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    email: string;
    foto: string;
    telefono: string;
    direccion: string;
    username: string;
    password: string;
    rol: Rol;

    constructor(id: number, nombre: string, apellido1: string, apellido2: string,
        email: string, foto: string, telefono: string,
        direccion: string, username: string, password: string, rol: Rol) {
        this.id = id;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.email = email;
        this.foto = foto;
        this.telefono = telefono;
        this.direccion = direccion;
        this.username = username;
        this.password = password;
        this.rol = rol;
    }
}