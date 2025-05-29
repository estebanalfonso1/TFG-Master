package tfgMaster.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tfgMaster.entity.Criterio;
import tfgMaster.entity.Profesor;
import tfgMaster.entity.Rubrica;
import tfgMaster.repository.CriterioRepository;
import tfgMaster.security.JWTUtils;

@Service
public class CriterioService {

	@Autowired
	private CriterioRepository criterioRepository;

	@Autowired
	private RubricaService rubricaService;

	@Autowired
	private JWTUtils JWTUtils;

	// Busca todos los CRITERIOS
	public List<Criterio> getAllCriterios() {
		return criterioRepository.findAll();
	}

	// Busca un CRITERIO
	public Optional<Criterio> getCriterioById(int id) {
		return criterioRepository.findById(id);
	}

	// Crear CRITERIO
	@Transactional
	public Criterio saveCriterio(Criterio criterio) {
		return criterioRepository.save(criterio);
	}

	@Transactional
	public Criterio saveCriterio(Criterio s, int idRubrica) {
		Criterio res = null;
		Optional<Rubrica> rubrica = rubricaService.getRubricaById(idRubrica);
		if (rubrica.isPresent()) {

			res = criterioRepository.save(s);

			rubrica.get().getCriterios().add(s);
			rubricaService.saveRubrica(rubrica.get());
		}
		return res;
	}

	// Actualizar CRITERIO
	@Transactional
	public Criterio updateCriterio(int id, Criterio criterio) {
		Optional<Criterio> criterioO = criterioRepository.findById(id);

		if (criterioO.isPresent()) {
			Profesor profesor = JWTUtils.userLogin();
			if (profesor != null) {
				criterioO.get().setDescripcion(criterio.getDescripcion());
				criterioO.get().setValoracionMinima(criterio.getValoracionMinima());
				criterioO.get().setValoracionMaxima(criterio.getValoracionMaxima());
				criterioO.get().setDeTutor(criterio.getDeTutor());
				return criterioRepository.save(criterioO.get());
			}
		}
		return null;
	}

	// Eliminar CRITERIO
	@Transactional
	public boolean deleteCriterio(int id) {
		Optional<Criterio> criterioO = criterioRepository.findById(id);
		Profesor profesor = JWTUtils.userLogin();
		boolean res = false;

		if (criterioO.isPresent()) {
			boolean contieneCriterio = false;
			for (Rubrica rubrica : rubricaService.getAllRubricas()) {
				if (rubrica.getCriterios().contains(criterioO.get())) {
					contieneCriterio = true;
				}
			}
			if (profesor != null && !contieneCriterio) {
				criterioRepository.deleteById(id);

				res = true;
			}
		}
		return res;
	}

}
