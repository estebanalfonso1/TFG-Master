package tfgMaster.controller;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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
import tfgMaster.entity.Profesor;
import tfgMaster.entity.Tribunal;
import tfgMaster.service.TribunalService;

@RestController
@RequestMapping("/tribunal")
@Tag(name = "Tribunal", description = "Operaciones relacionadas con la gestión de los tribunales")
public class TribunalController {

	@Autowired
	private TribunalService tribunalService;

	@PostMapping
	@Operation(summary = "Crear un nuevo tribunal")
	@ApiResponses(value = { @ApiResponse(responseCode = "201", description = "Tribunal creado exitosamente"),
			@ApiResponse(responseCode = "400", description = "Error al crear el tribunal") })
	public void saveTribunal(@RequestBody Tribunal tribunal) {
		Tribunal tribunalSave = tribunalService.saveTribunal(tribunal);
		if (tribunalSave == null) {
			ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al crear el tribunal");
		} else {
			ResponseEntity.status(HttpStatus.ACCEPTED).body("Tribunal creado correctamente");
		}
	}

	@PutMapping("/{id}")
	@Operation(summary = "Actualizar un tribunal existente")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Tribunal actualizado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Tribunal no encontrado"),
			@ApiResponse(responseCode = "400", description = "Tribunal inválido, e\"Tribunal no encontrado o no es formado por el profesor logueado") })
	public void updateTribunal(@PathVariable int id, @RequestBody Tribunal updatedTribunal) {
		Tribunal response = tribunalService.updateTribunal(id, updatedTribunal);
		if (response != null) {
			ResponseEntity.status(HttpStatus.OK).body("Tribunal actualizado exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tribunal no encontrado");
		}
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Eliminar un tribunal por ID")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Tribunal eliminado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Tribunal no encontrado o no es formado por el profesor logueado") })
	public void deleteTribunal(@PathVariable int id) {
		if (tribunalService.deleteTribunal(id)) {
			ResponseEntity.status(HttpStatus.OK).body("Tribunal eliminado exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Tribunal no encontrado o no es formado por el profesor logueado");
		}
	}

	@GetMapping("/{id}")
	@Operation(summary = "Buscar un tribunal por ID")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Tribunal encontrado"),
			@ApiResponse(responseCode = "404", description = "Tribunal no encontrado") })
	public ResponseEntity<Tribunal> findOneTribunal(@PathVariable int id) {
		Optional<Tribunal> tribunal = tribunalService.getTribunalById(id);
		if (!tribunal.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		} else {
			return ResponseEntity.ok(tribunal.get());
		}
	}

	@GetMapping
	@Operation(summary = "Obtener todos los tribunales")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Lista de tribunales obtenida exitosamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor") })
	public ResponseEntity<List<Tribunal>> getAllTribunales() {
		List<Tribunal> listTribunales = tribunalService.getAllTribunales();
		return ResponseEntity.ok(listTribunales);
	}

	@GetMapping("/deProfesor")
	@Operation(summary = "Obtener todos los tribunales de un profesor")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Lista de tribunales obtenida exitosamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor") })
	public ResponseEntity<Set<Tribunal>> getAllTribunalesByProfesor() {
		Set<Tribunal> listTribunales = tribunalService.getAllTribunalesByProfesor();
		return ResponseEntity.ok(listTribunales);
	}

	@GetMapping("/profesores/{id}")
	@Operation(summary = "Obtener todos los profesores de un tribunal")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Lista de profesores obtenida exitosamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor") })
	public ResponseEntity<Set<Profesor>> getAllProfesoresByTribunal(@PathVariable int id) {
		Set<Profesor> listProfesores = tribunalService.getAllProfesoresByTribunal(id);
		return ResponseEntity.ok(listProfesores);
	}

	@GetMapping("/calificar/{id}")
	@Operation(summary = "Calificar un tribunal por ID")
	@ApiResponses(value = { @ApiResponse(responseCode = "202", description = "Tribunal calificado exitosamente"),
			@ApiResponse(responseCode = "400", description = "Error al calificar el tribunal") })
	public ResponseEntity<Void> qualifyTribunal(@PathVariable int id) {
		Boolean verEstado = tribunalService.qualifyTribunal(id);
		if (verEstado == false) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		} else {
			return ResponseEntity.status(HttpStatus.ACCEPTED).build();
		}
	}

	@GetMapping("/deAlumno")
	@Operation(summary = "Obtener todos los tribunales de un profesor")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Lista de tribunales obtenida exitosamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor") })
	public ResponseEntity<Set<Tribunal>> getAllTribunalesByAlumno() {
		Set<Tribunal> listTribunales = tribunalService.getAllTribunalesByAlumno();
		return ResponseEntity.ok(listTribunales);
	}

}
