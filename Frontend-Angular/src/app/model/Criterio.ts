export class Criterio {
    id!: number;
    puntuacionObtenida: number;
    puntuacionMaxima: number;
    puntuacionMinima: number;
    puntuacionDeTutor: number;
    descripcion: string;

    constructor(puntuacionObtenida: number, puntuacionMaxima: number, puntuacionMinima: number, puntuacionDeTutor: number, descripcion: string
    ) {
        this.puntuacionObtenida = puntuacionObtenida,
            this.puntuacionMaxima = puntuacionMaxima,
            this.puntuacionMinima = puntuacionMinima,
            this.puntuacionDeTutor = puntuacionDeTutor,
            this.descripcion = descripcion
    }
}