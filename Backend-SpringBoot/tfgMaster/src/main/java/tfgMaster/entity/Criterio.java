package tfgMaster.entity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Criterio extends DomainEntity {
	@Max(10)
	@Min(0)	
	private int puntuacionObtenida;

	@Max(10)
	@Min(0)
	private int puntuacionMaxima;

	@Max(10)
	@Min(0)
	private int puntuacionMinima;

	@Max(10)
	@Min(0)
	private int puntuacionDeTutor;

	@NotBlank
	private String descripcion;

	public Criterio() {
		super();
	}

	public int getPuntuacionObtenida() {
		return puntuacionObtenida;
	}

	public void setPuntuacionObtenida(int puntuacionObtenida) {
		this.puntuacionObtenida = puntuacionObtenida;
	}

	public int getPuntuacionMaxima() {
		return puntuacionMaxima;
	}

	public void setPuntuacionMaxima(int puntuacionMaxima) {
		this.puntuacionMaxima = puntuacionMaxima;
	}

	public int getPuntuacionMinima() {
		return puntuacionMinima;
	}

	public void setPuntuacionMinima(int puntuacionMinima) {
		this.puntuacionMinima = puntuacionMinima;
	}

	public int getPuntuacionDeTutor() {
		return puntuacionDeTutor;
	}

	public void setPuntuacionDeTutor(int puntuacionDeTutor) {
		this.puntuacionDeTutor = puntuacionDeTutor;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

}
