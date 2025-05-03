package tfgMaster.entity;

import java.util.Date;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Rubrica extends DomainEntity {
	@NotBlank
	private String descripcion;

	@NotBlank
	private Date fechaPublicacion;

	@OneToOne(optional = false)
	private Profesor profesor;

	@OneToMany
	private Set<Criterio> criterios;

	public Rubrica() {
		super();
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Date getFechaPublicacion() {
		return fechaPublicacion;
	}

	public void setFechaPublicacion(Date fechaPublicacion) {
		this.fechaPublicacion = fechaPublicacion;
	}

	public Set<Criterio> getCriterios() {
		return criterios;
	}

	public void setCriterios(Set<Criterio> criterios) {
		this.criterios = criterios;
	}

	public Profesor getProfesor() {
		return profesor;
	}

	public void setProfesor(Profesor profesor) {
		this.profesor = profesor;
	}

}
