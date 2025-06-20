package tfgMaster.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import tfgMaster.entity.Alumno;
import tfgMaster.entity.Profesor;
import tfgMaster.service.ProfesorService;

@RestController
@RequestMapping("/profesor")
@Tag(name = "Profesor", description = "Operaciones relacionadas con la gestión de los profesores")
public class ProfesorController {
	@Autowired
	private ProfesorService profesorService;

	@PostMapping
	@ApiResponses(value = { @ApiResponse(responseCode = "201", description = "Profesor creado exitosamente"),
			@ApiResponse(responseCode = "400", description = "Solicitud inválida"),
			@ApiResponse(responseCode = "409", description = "El username ya está en uso") })
	public void saveProfesor(@RequestBody Profesor profesor) {
		if (profesorService.findByUsername(profesor.getUsername()).isPresent()) {
			ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El username ya está en uso");
		} else {
			Profesor p = profesorService.saveProfesor(profesor);
			if (p != null) {
				ResponseEntity.status(HttpStatus.CREATED).body("Profesor creado exitosamente");
			} else {
				ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se pudo crear el profesor");
			}
		}
	}

	@PutMapping
	@Operation(summary = "Actualizar un profesor existente")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Profesor actualizado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Profesor no encontrado"),
			@ApiResponse(responseCode = "400", description = "Solicitud inválida") })
	public void updateProfesor(@RequestBody Profesor updatedProfesor) {
		Profesor response = profesorService.updateProfesor(updatedProfesor);
		if (response != null) {
			ResponseEntity.status(HttpStatus.OK).body("Profesor actualizado exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profesor no encontrado");
		}
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Eliminar un profesor logueado")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Profesor eliminado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Profesor no encontrado") })
	public void deleteProfesor(@PathVariable int id) {
		if (profesorService.deleteProfesor(id)) {
			ResponseEntity.status(HttpStatus.OK).body("Profesor eliminado exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profesor no encontrado");
		}
	}

	@GetMapping
	@Operation(summary = "Obtener todos los profesores")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Lista de profesores obtenida exitosamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor") })
	public ResponseEntity<List<Profesor>> getAllProfesores() {
		List<Profesor> listProfesores = profesorService.getAllProfesores();
		return ResponseEntity.ok(listProfesores);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Buscar un profesor por ID")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Profesor encontrado"),
			@ApiResponse(responseCode = "404", description = "Profesor no encontrado")
	})
	public ResponseEntity<Profesor> findOneProfesor(@PathVariable int id) {
		Optional<Profesor> profesor = profesorService.getProfesorById(id);
		if (profesor.isPresent()) {
			return ResponseEntity.ok(profesor.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
}
