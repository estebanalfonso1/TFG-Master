package tfgMaster.service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tfgMaster.entity.Criterio;
import tfgMaster.entity.Profesor;
import tfgMaster.entity.Rubrica;
import tfgMaster.entity.Tribunal;
import tfgMaster.repository.RubricaRepository;
import tfgMaster.security.JWTUtils;

@Service
public class RubricaService {
	@Autowired
	private RubricaRepository rubricaRepository;

	@Autowired
	private TribunalService tribunalService;

	@Autowired
	private JWTUtils JWTUtils;

	// Busca todas las RUBRICAS
	public List<Rubrica> getAllRubricas() {
		return rubricaRepository.findAll();
	}

	// Busca una RUBRICA
	public Optional<Rubrica> getRubricaById(int id) {
		return rubricaRepository.findById(id);
	}

	// Crear RUBRICA
	@Transactional
	public Rubrica saveRubrica(Rubrica rubrica) {

		rubrica.setFechaPublicacion(new Date());
		rubrica.setCriterios(new HashSet<Criterio>());

		Rubrica rubricaSave = rubricaRepository.save(rubrica);

		return rubricaSave;
	}

	// Actualizar RUBRICA
	@Transactional
	public Rubrica updateRubrica(int id, Rubrica rubrica) {
		Optional<Rubrica> rubricaO = rubricaRepository.findById(id);

		if (rubricaO.isPresent()) {
			Profesor profesor = JWTUtils.userLogin();
			if (profesor != null) {
				return rubricaRepository.save(rubricaO.get());
			}
		}
		return null;
	}

	// Eliminar RUBRICA
	@Transactional
	public boolean deleteRubrica(int id) {
		Optional<Rubrica> rubricaO = rubricaRepository.findById(id);
		Profesor profesor = JWTUtils.userLogin();
		boolean res = false;

		if (rubricaO.isPresent()) {
			boolean contieneRubrica = false;
			for (Tribunal tribunal : tribunalService.getAllTribunales()) {
				if (tribunal.getRubricas().contains(rubricaO.get())) {
					contieneRubrica = true;
				}
			}
			if (profesor != null && !contieneRubrica) {
				rubricaRepository.deleteById(id);

				res = true;
			}
		}
		return res;
	}

}
