package tfgMaster.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
	public ResponseEntity<String> saveAlumno(@RequestBody Alumno alumno) {
		if (alumnoService.findByUsername(alumno.getUsername()).isPresent()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El username ya está en uso");
		} else {
			Alumno a = alumnoService.saveAlumno(alumno);
			if (a != null) {
				return ResponseEntity.status(HttpStatus.CREATED).body("Alumno creado exitosamente");
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se pudo crear el alumno");
			}
		}
	}

	@PutMapping
	@Operation(summary = "Actualizar un alumno existente")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Alumno actualizado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Alumno no encontrado"),
			@ApiResponse(responseCode = "400", description = "Solicitud inválida") })
	public ResponseEntity<String> updateAlumno(@RequestBody Alumno updatedAlumno) {
		Alumno response = alumnoService.updateAlumno(updatedAlumno);
		if (response != null) {
			return ResponseEntity.status(HttpStatus.OK).body("Alumno actualizado exitosamente");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alumno no encontrado");
		}
	}

	@DeleteMapping
	@Operation(summary = "Eliminar un alumno logueado")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Alumno eliminado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Alumno no encontrado") })
	public ResponseEntity<String> deleteAlumno() {
		if (alumnoService.deleteAlumno()) {
			return ResponseEntity.status(HttpStatus.OK).body("Alumno eliminado exitosamente");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alumno no encontrado");
		}
	}
}
