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
import tfgMaster.service.AlumnoService;

@RestController
@RequestMapping("/alumno")
@Tag(name = "Alumno", description = "Operaciones relacionadas con la gestión de los alumnos")
public class AlumnoController {
	@Autowired
	private AlumnoService alumnoService;

	@PostMapping
	@ApiResponses(value = { @ApiResponse(responseCode = "201", description = "Alumno creado exitosamente"),
			@ApiResponse(responseCode = "400", description = "Solicitud inválida"),
			@ApiResponse(responseCode = "409", description = "El username ya está en uso") })
	public void saveAlumno(@RequestBody Alumno alumno) {
		if (alumnoService.findByUsername(alumno.getUsername()).isPresent()) {
			ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El username ya está en uso");
		} else {
			Alumno a = alumnoService.saveAlumno(alumno);
			if (a != null) {
				ResponseEntity.status(HttpStatus.CREATED).body("Alumno creado exitosamente");
			} else {
				ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se pudo crear el alumno");
			}
		}
	}

	@PutMapping
	@Operation(summary = "Actualizar un alumno existente")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Alumno actualizado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Alumno no encontrado"),
			@ApiResponse(responseCode = "400", description = "Solicitud inválida") })
	public void updateAlumno(@RequestBody Alumno updatedAlumno) {
		Alumno response = alumnoService.updateAlumno(updatedAlumno);
		if (response != null) {
			ResponseEntity.status(HttpStatus.OK).body("Alumno actualizado exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alumno no encontrado");
		}
	}

	@PutMapping("/{id}")
	@Operation(summary = "Actualizar un alumno existente")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Alumno actualizado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Alumno no encontrado"),
			@ApiResponse(responseCode = "400", description = "Solicitud inválida") })
	public void updateAlumnoById(@PathVariable int id, @RequestBody Alumno updatedAlumno) {
		Alumno response = alumnoService.updateAlumnoById(id, updatedAlumno);
		if (response != null) {
			ResponseEntity.status(HttpStatus.OK).body("Alumno actualizado exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alumno no encontrado");
		}
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Eliminar un alumno logueado")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Alumno eliminado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Alumno no encontrado") })
	public void deleteAlumno(@PathVariable int id) {
		if (alumnoService.deleteAlumno(id)) {
			ResponseEntity.status(HttpStatus.OK).body("Alumno eliminado exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alumno no encontrado");
		}
	}

	@GetMapping("/{id}")
	@Operation(summary = "Buscar un alumno por ID")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Alumno encontrado"),
			@ApiResponse(responseCode = "404", description = "Alumno no encontrado")
	})
	public ResponseEntity<Alumno> findOneAlumno(@PathVariable int id) {
		Optional<Alumno> alumno = alumnoService.getAlumnoById(id);
		if (alumno.isPresent()) {
			return ResponseEntity.ok(alumno.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@GetMapping
	@Operation(summary = "Obtener todos los alumnos")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Lista de alumnos obtenida exitosamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor") })
	public ResponseEntity<List<Alumno>> getAllAlumnos() {
		List<Alumno> listAlumnos = alumnoService.getAllAlumnos();
		return ResponseEntity.ok(listAlumnos);
	}

	@GetMapping("/deProfesor")
	@Operation(summary = "Obtener todos los alumnos de un profesor")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Lista de alumnos obtenida exitosamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor") })
	public ResponseEntity<List<Alumno>> getAllAlumnosByProfesor() {
		List<Alumno> listAlumnos = alumnoService.getAllAlumnosByProfesor();
		return ResponseEntity.ok(listAlumnos);
	}

}
