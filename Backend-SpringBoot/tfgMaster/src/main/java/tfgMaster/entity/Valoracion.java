package tfgMaster.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
public class Valoracion extends DomainEntity {
    @ManyToOne(optional = false)
    private Profesor profesor;

    @ManyToOne(optional = false)
    private Tribunal tribunal;

    @ManyToOne(optional = false)
    private Criterio criterio;

    @Max(10)
	@Min(0)
	private double valoracion;

    public Valoracion() {
		super();
	}

    public Profesor getProfesor() {
		return profesor;
	}

	public void setProfesor(Profesor profesor) {
		this.profesor = profesor;
	}

    public Tribunal getTribunal() {
		return tribunal;
	}

	public void setTribunal(Tribunal tribunal) {
		this.tribunal = tribunal;
	}

    public Criterio getCriterio() {
		return criterio;
	}

	public void setCriterio(Criterio criterio) {
		this.criterio = criterio;
	}

    public double getValoracion() {
		return valoracion;
	}

	public void setValoracion(double valoracion) {
		this.valoracion = valoracion;
	}
}
