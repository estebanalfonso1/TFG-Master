package tfgMaster.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tfgMaster.entity.Alumno;
import tfgMaster.entity.Rol;
import tfgMaster.repository.AlumnoRepository;
import tfgMaster.security.JWTUtils;

@Service
public class AlumnoService {
	@Autowired
	private AlumnoRepository alumnoRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JWTUtils JWTUtils;
	
	// Buscar ALUMNO por nombre de usuario
	public Optional<Alumno> findByUsername(String username) {		
		return alumnoRepository.findByUsername(username);
	}
	
	// Busca todos los ALUMNOS
		public List<Alumno> getAllAlumnos() {
			return alumnoRepository.findAll();
		}

		// Buscar ALUMNO por Id
		public Optional<Alumno> getAlumnoById(int id) {
			return alumnoRepository.findById(id);
		}
		
		// Crear ALUMNO
		@Transactional
		public Alumno saveAlumno(Alumno alumno) {
			alumno.setCalificacionTotal(0);
			alumno.setRol(Rol.ALUMNO);
			alumno.setPassword(passwordEncoder.encode(alumno.getPassword()));
			return alumnoRepository.save(alumno);
		}
		
		// Actualizar ALUMNO
		@Transactional
		public Alumno updateAlumno(Alumno alumnoU) {
			Alumno alumno = JWTUtils.userLogin();
			if (alumno != null) {
				alumno.setEmail(alumnoU.getEmail());
				alumno.setFoto(alumnoU.getFoto());
				alumno.setTelefono(alumnoU.getTelefono());
				alumno.setDireccion(alumnoU.getDireccion());
				alumno.setCalificacionTotal(alumnoU.getCalificacionTotal());
				alumno.setCurso(alumnoU.getCurso());
				return alumnoRepository.save(alumno);
			}
			return null;
		}

		// Actualizar ALUMNO por id
		@Transactional
		public Alumno updateAlumnoById(int id, Alumno alumnoU) {
			Optional<Alumno> alumno = alumnoRepository.findById(id);
			if (alumno != null) {
				alumno.get().setNombre(alumnoU.getNombre());
				alumno.get().setApellido1(alumnoU.getApellido1());
				alumno.get().setApellido2(alumnoU.getApellido2());
				alumno.get().setEmail(alumnoU.getEmail());
				alumno.get().setFoto(alumnoU.getFoto());
				alumno.get().setTelefono(alumnoU.getTelefono());
				alumno.get().setDireccion(alumnoU.getDireccion());
				alumno.get().setCalificacionTotal(alumnoU.getCalificacionTotal());
				alumno.get().setCurso(alumnoU.getCurso());
				return alumnoRepository.save(alumno.get());
			}
			return null;
		}
		
		// Eliminar ALUMNO
		@Transactional
		public boolean deleteAlumno(int id) {
			Optional<Alumno> alumno = alumnoRepository.findById(id);
			if (alumno != null) {
				alumnoRepository.deleteById(alumno.get().getId());
				return true;
			}
			return false;
		}
	
}
