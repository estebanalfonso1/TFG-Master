package tfgMaster.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tfgMaster.entity.Alumno;
import tfgMaster.entity.Profesor;
import tfgMaster.entity.Tribunal;
import tfgMaster.entity.Valoracion;
import tfgMaster.repository.TribunalRepository;
import tfgMaster.security.JWTUtils;

@Service
public class TribunalService {
	@Autowired
	private TribunalRepository tribunalRepository;

	@Autowired
	private JWTUtils JWTUtils;

	// Busca todos los TRIBUNALES
	public List<Tribunal> getAllTribunales() {
		return tribunalRepository.findAll();
	}

	// Busca un TRIBUNAL
	public Optional<Tribunal> getTribunalById(int id) {
		return tribunalRepository.findById(id);
	}

	// Obtener TRIBUNALES a los que pertenece un PROFESOR
	public Set<Tribunal> getAllTribunalesByProfesor() {
		Profesor profesor = JWTUtils.userLogin();

		Set<Tribunal> tribunales = new HashSet<Tribunal>();

		for (Tribunal tribunal : tribunalRepository.findAll()) {
			if (tribunal.getTieneProfesores().contains(profesor)) {
				tribunales.add(tribunal);
			}
		}

		return tribunales;
	}

	// Obtener PROFESORES que forman un TRIBUNAL
	public Set<Profesor> getAllProfesoresByTribunal(int idTribunal) {

		Optional<Tribunal> tribunal = getTribunalById(idTribunal);

		if (tribunal.isPresent()) {
			return tribunal.get().getTieneProfesores();
		}

		return null;
	}

	// Calificar TRIBUNAL
	public boolean qualifyTribunal(int id) {
		boolean res = false;
		Optional<Tribunal> tribunalO = tribunalRepository.findById(id);
		if (tribunalO.isPresent()) {
			tribunalO.get().setEstado("CALIFICADO");
			tribunalRepository.save(tribunalO.get());
			res = true;
		}
		return res;
	}

	// Crear TRIBUNAL
	@Transactional
	public Tribunal saveTribunal(Tribunal tribunal) {
		tribunal.setValoraciones(new HashSet<Valoracion>());

		Tribunal tribunalSave = tribunalRepository.save(tribunal);

		return tribunalSave;
	}

	// Actualizar TRIBUNAL
	@Transactional
	public Tribunal updateTribunal(int id, Tribunal tribunal) {
		Optional<Tribunal> tribunalO = tribunalRepository.findById(id);
		if (tribunalO.isPresent()) {
			Object userLogin = JWTUtils.userLogin();

			if (userLogin instanceof Profesor profesor && tribunalO.get().getTieneProfesores().contains(profesor)) {
				tribunalO.get().setFechaEntrega(tribunal.getFechaEntrega());
				tribunalO.get().setFechaFin(tribunal.getFechaFin());
				tribunalO.get().setEstado("PENDIENTE");
				tribunalO.get().setArchivo(tribunal.getArchivo());
				tribunalO.get().setRubrica(tribunal.getRubrica());
				tribunalO.get().setValoraciones(tribunal.getValoraciones());
				return tribunalRepository.save(tribunalO.get());

			} else if (userLogin instanceof Alumno alumno && tribunalO.get().getAlumno().equals(alumno)) {
				tribunalO.get().setArchivo(tribunal.getArchivo());
				return tribunalRepository.save(tribunalO.get());
			}
		}
		return null;
	}

	// Eliminar TRIBUNAL
	@Transactional
	public boolean deleteTribunal(int id) {
		Optional<Tribunal> tribunalO = tribunalRepository.findById(id);
		Profesor profesor = JWTUtils.userLogin();
		boolean res = false;

		if (tribunalO.isPresent()) {
			if (profesor != null && tribunalO.get().getEstado().equals("PENDIENTE")) {

				tribunalRepository.deleteById(id);

				res = true;
			}
		}
		return res;
	}

}
