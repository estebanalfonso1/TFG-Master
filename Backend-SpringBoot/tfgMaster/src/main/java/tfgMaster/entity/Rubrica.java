package tfgMaster.entity;

import java.util.Date;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Rubrica extends DomainEntity {
	@NotBlank
	private String descripcion;

	private boolean esBorrador;

	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date fechaPublicacion;

	@ManyToMany
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

	public boolean getEsBorrador() {
		return esBorrador;
	}

	public void setEsBorrador(boolean esBorrador) {
		this.esBorrador = esBorrador;
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

}
