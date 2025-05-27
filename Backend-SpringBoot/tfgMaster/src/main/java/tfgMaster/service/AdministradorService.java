package tfgMaster.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tfgMaster.entity.Administrador;
import tfgMaster.entity.Rol;
import tfgMaster.repository.AdministradorRepository;
import tfgMaster.security.JWTUtils;


@Service
public class AdministradorService {
	@Autowired
	private AdministradorRepository administradorRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JWTUtils JWTUtils;
	
	// Buscar ADMINISTRADOR por nombre de usuario
	public Optional<Administrador> findByUsername(String username) {
		return administradorRepository.findByUsername(username);
	}
	
	// Busca todos los ADMINISTRADORES
	public List<Administrador> getAllAdministradores() {
		return administradorRepository.findAll();
	}

	// Buscar ADMINISTRADOR por Id
	public Optional<Administrador> getAdministradorById(int id) {
		return administradorRepository.findById(id);
	}
	
	// Crear ADMINISTRADOR
	@Transactional
	public Administrador saveAdministrador(Administrador administrador) {
		administrador.setRol(Rol.ADMINISTRADOR);
		administrador.setPassword(passwordEncoder.encode(administrador.getPassword()));
		return administradorRepository.save(administrador);
	}
	
	// Actualizar ADMINISTRADOR
	@Transactional
	public Administrador updateAdministrador(Administrador administradorU) {
		Administrador administrador = JWTUtils.userLogin();
		if (administrador != null) {
			administrador.setNombre(administradorU.getNombre());
			administrador.setApellido1(administradorU.getApellido1());
			administrador.setApellido2(administradorU.getApellido2());
			administrador.setEmail(administradorU.getEmail());
			administrador.setFoto(administradorU.getFoto());
			administrador.setTelefono(administradorU.getTelefono());
			administrador.setDireccion(administradorU.getDireccion());
			return administradorRepository.save(administrador);
		}
		return null;
	}
	
	// Eliminar ADMINISTRADOR
	@Transactional
	public boolean deleteAdministrador() {
		Administrador administrador = JWTUtils.userLogin();
		if (administrador != null) {
			administradorRepository.deleteById(administrador.getId());
			return true;
		}
		return false;
	}
	
	// Crear ADMINISTRADOR por defecto
	public void administradorPorDefecto() {
		if (this.getAllAdministradores().size() <= 0) {
			Administrador defaultAdministrador = new Administrador();
			defaultAdministrador.setUsername("administrador");
			defaultAdministrador.setPassword(passwordEncoder.encode("adminEsteban123admin"));
			defaultAdministrador.setNombre("Administrador");
			defaultAdministrador.setApellido1("Administrador1");
			defaultAdministrador.setApellido2("Administrador2");
			defaultAdministrador.setEmail("administrador@default.com");
			defaultAdministrador.setFoto(null);
			defaultAdministrador.setTelefono("623456789");
			defaultAdministrador.setDireccion("Dirección por defecto");
			defaultAdministrador.setRol(Rol.ADMINISTRADOR);

			System.out.println("Usuario ADMINISTRADOR creado por defecto");
			administradorRepository.save(defaultAdministrador);
		}
	}
	
}
