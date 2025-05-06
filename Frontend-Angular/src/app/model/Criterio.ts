export class Criterio {
    id!: number;
    valoracionMaxima: number;
    valoracionMinima: number;
    deTutor: boolean;
    descripcion: string;

    constructor(valoracionMaxima: number, valoracionMinima: number, deTutor: boolean, descripcion: string
    ) {
        this.valoracionMaxima = valoracionMaxima,
            this.valoracionMinima = valoracionMinima,
            this.deTutor = deTutor,
            this.descripcion = descripcion
    }
}