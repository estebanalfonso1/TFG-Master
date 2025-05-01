package tfgMaster.entity;

import java.util.Date;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
public class Tribunal extends DomainEntity {
	private Date fechaEntrega;

	@NotBlank
	@Future
	private Date fechaFin;

	@NotBlank
	@Pattern(regexp = "PENDIENTE|ENTREGADO|CALIFICADO")
	private String estado;

	private String archivo;

	private String comentario;

	@ManyToMany
	private Set<Profesor> tieneProfesores;

	@OneToOne(optional = false)
	private Alumno alumno;

	@OneToMany
	private Set<Rubrica> rubricas;

	public Tribunal() {
		super();
	}

	public Date getFechaEntrega() {
		return fechaEntrega;
	}

	public void setFechaEntrega(Date fechaEntrega) {
		this.fechaEntrega = fechaEntrega;
	}

	public Date getFechaFin() {
		return fechaFin;
	}

	public void setFechaFin(Date fechaFin) {
		this.fechaFin = fechaFin;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public String getArchivo() {
		return archivo;
	}

	public void setArchivo(String archivo) {
		this.archivo = archivo;
	}

	public String getComentario() {
		return comentario;
	}

	public void setComentario(String comentario) {
		this.comentario = comentario;
	}

	public Set<Profesor> getTieneProfesores() {
		return tieneProfesores;
	}

	public void setTieneProfesores(Set<Profesor> tieneProfesores) {
		this.tieneProfesores = tieneProfesores;
	}

	public Alumno getAlumno() {
		return alumno;
	}

	public void setAlumno(Alumno alumno) {
		this.alumno = alumno;
	}

	public Set<Rubrica> getRubricas() {
		return rubricas;
	}

	public void setRubricas(Set<Rubrica> rubricas) {
		this.rubricas = rubricas;
	}

}
