package tfgMaster.entity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
public class Alumno extends Actor {
	@NotBlank
	@Min(0)
	@Max(10)
	private double calificacionTotal;

	@NotBlank
	@Pattern(regexp = "DAW|ASIR|AFI")
	private String curso;

	public Alumno() {
		super();
	}

	public double getCalificacionTotal() {
		return calificacionTotal;
	}

	public void setCalificacionTotal(double calificacionTotal) {
		this.calificacionTotal = calificacionTotal;
	}

	public String getCurso() {
		return curso;
	}

	public void setCurso(String curso) {
		this.curso = curso;
	}

}
