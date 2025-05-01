package tfgMaster.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tfgMaster.entity.Profesor;
import tfgMaster.entity.Rol;
import tfgMaster.repository.ProfesorRepository;
import tfgMaster.security.JWTUtils;

@Service
public class ProfesorService {
	@Autowired
	private ProfesorRepository profesorRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JWTUtils JWTUtils;

	// Buscar PROFESOR por nombre de usuario
	public Optional<Profesor> findByUsername(String username) {
		return profesorRepository.findByUsername(username);
	}

	// Busca todos los PROFESORES
	public List<Profesor> getAllProfesores() {
		return profesorRepository.findAll();
	}

	// Buscar PROFESOR por Id
	public Optional<Profesor> getProfesorById(int id) {
		return profesorRepository.findById(id);
	}

	// Guardar PROFESOR
	@Transactional
	public Profesor saveProfesor(Profesor profesor) {
		return profesorRepository.save(profesor);
	}

	// Crear PROFESOR
	@Transactional
	public Profesor createProfesor(Profesor profesor) {
		profesor.setRol(Rol.PROFESOR);
		profesor.setPassword(passwordEncoder.encode(profesor.getPassword()));
		return profesorRepository.save(profesor);
	}

	// Actualizar PROFESOR
	@Transactional
	public Profesor updateProfesor(Profesor profesorU) {
		Profesor profesor = JWTUtils.userLogin();
		if (profesor != null) {
			profesor.setNombre(profesorU.getNombre());
			profesor.setApellido1(profesorU.getApellido1());
			profesor.setApellido2(profesorU.getApellido2());
			profesor.setEmail(profesorU.getEmail());
			profesor.setFoto(profesorU.getFoto());
			profesor.setTelefono(profesorU.getTelefono());
			profesor.setDireccion(profesorU.getDireccion());
			return profesorRepository.save(profesor);
		}
		return null;
	}

	// Eliminar PROFESOR
	@Transactional
	public boolean deleteProfesor() {
		Profesor profesor = JWTUtils.userLogin();
		if (profesor != null) {
			profesorRepository.deleteById(profesor.getId());
			return true;
		}
		return false;
	}
}
