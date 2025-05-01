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
import tfgMaster.entity.Rubrica;
import tfgMaster.service.RubricaService;

@RestController
@RequestMapping("/rubrica")
@Tag(name = "Rubrica", description = "Operaciones relacionadas con la gestión de las rubricas")
public class RubricaController {

	@Autowired
	private RubricaService rubricaService;

	@PostMapping
	@Operation(summary = "Crear una nueva rubrica")
	@ApiResponses(value = { @ApiResponse(responseCode = "201", description = "Rubrica creada exitosamente"),
			@ApiResponse(responseCode = "400", description = "Error al crear la rubrica") })
	public ResponseEntity<String> saveRubrica(@RequestBody Rubrica rubrica) {
		Rubrica rubricaSave = rubricaService.saveRubrica(rubrica);
		if (rubricaSave == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al crear la rubrica");
		} else {
			return ResponseEntity.status(HttpStatus.ACCEPTED).body("Rubrica creada correctamente");
		}
	}

	@PutMapping("/{id}")
	@Operation(summary = "Actualizar una rubrica existente")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Rubrica actualizada exitosamente"),
			@ApiResponse(responseCode = "404", description = "Rubrica no encontrada"),
			@ApiResponse(responseCode = "400", description = "Rubrica inválido, e\"Rubrica no encontrada o no es creada por el profesor logueado") })
	public void updateRubrica(@PathVariable int id, @RequestBody Rubrica updatedRubrica) {
		Rubrica response = rubricaService.updateRubrica(id, updatedRubrica);
		if (response != null) {
			ResponseEntity.status(HttpStatus.OK).body("Rubrica actualizada exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rubrica no encontrada");
		}
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Eliminar un rubrica por ID")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Rubrica eliminada exitosamente"),
			@ApiResponse(responseCode = "404", description = "Rubrica no encontrada o no es creada por el profesor logueado") })
	public void deleteRubrica(@PathVariable int id) {
		if (rubricaService.deleteRubrica(id)) {
			ResponseEntity.status(HttpStatus.OK).body("Rubrica eliminada exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Rubrica no encontrada o no es creada por el profesor logueado");
		}
	}

	@GetMapping("/{id}")
	@Operation(summary = "Buscar una rubrica por ID")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Rubrica encontrada"),
			@ApiResponse(responseCode = "404", description = "Rubrica no encontrada") })
	public ResponseEntity<Rubrica> findOneRubrica(@PathVariable int id) {
		Optional<Rubrica> rubrica = rubricaService.getRubricaById(id);
		if (!rubrica.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		} else {
			return ResponseEntity.ok(rubrica.get());
		}
	}

	@GetMapping
	@Operation(summary = "Obtener todas las rubricas")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Lista de rubricas obtenida exitosamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor") })
	public ResponseEntity<List<Rubrica>> getAllRubricas() {
		List<Rubrica> listRubricas = rubricaService.getAllRubricas();
		return ResponseEntity.ok(listRubricas);
	}
}
