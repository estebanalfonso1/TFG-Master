package tfgMaster.entity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Criterio extends DomainEntity {
	@Max(10)
	@Min(0)
	private double valoracionMaxima;

	@Max(10)
	@Min(0)
	private double valoracionMinima;

	private boolean deTutor;

	@NotBlank
	private String descripcion;

	public Criterio() {
		super();
	}

	public double getValoracionMaxima() {
		return valoracionMaxima;
	}

	public void setValoracionMaxima(double valoracionMaxima) {
		this.valoracionMaxima = valoracionMaxima;
	}

	public double getValoracionMinima() {
		return valoracionMinima;
	}

	public void setValoracionMinima(double valoracionMinima) {
		this.valoracionMinima = valoracionMinima;
	}

	public boolean getDeTutor() {
		return deTutor;
	}

	public void setDeTutor(boolean deTutor) {
		this.deTutor = deTutor;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

}
