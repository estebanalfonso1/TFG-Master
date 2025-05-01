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
import tfgMaster.entity.Criterio;
import tfgMaster.service.CriterioService;

@RestController
@RequestMapping("/criterio")
@Tag(name = "Criterio", description = "Operaciones relacionadas con la gestión de los criterios")
public class CriterioController {
	@Autowired
	private CriterioService criterioService;

	@PostMapping
	@Operation(summary = "Crear un nuevo criterio")
	@ApiResponses(value = { @ApiResponse(responseCode = "201", description = "Criterio creado exitosamente"),
			@ApiResponse(responseCode = "400", description = "Error al crear el criterio") })
	public ResponseEntity<String> saveCriterio(@RequestBody Criterio criterio) {
		Criterio criterioSave = criterioService.saveCriterio(criterio);
		if (criterioSave == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al crear el criterio");
		} else {
			return ResponseEntity.status(HttpStatus.ACCEPTED).body("Criterio creado correctamente");
		}
	}

	@PutMapping("/{id}")
	@Operation(summary = "Actualizar un criterio existente")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Criterio actualizado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Criterio no encontrado"),
			@ApiResponse(responseCode = "400", description = "Criterio inválido, e\"Criterio no encontrado o no es creado por el profesor logueado") })
	public void updateCriterio(@PathVariable int id, @RequestBody Criterio updatedCriterio) {
		Criterio response = criterioService.updateCriterio(id, updatedCriterio);
		if (response != null) {
			ResponseEntity.status(HttpStatus.OK).body("Criterio actualizado exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.NOT_FOUND).body("Criterio no encontrado");
		}
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Eliminar un criterio por ID")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Criterio eliminado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Criterio no encontrado o no es creado por el profesor logueado") })
	public void deleteCriterio(@PathVariable int id) {
		if (criterioService.deleteCriterio(id)) {
			ResponseEntity.status(HttpStatus.OK).body("Criterio eliminado exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Criterio no encontrado o no es creado por el profesor logueado");
		}
	}

	@GetMapping("/{id}")
	@Operation(summary = "Buscar un criterio por ID")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Criterio encontrado"),
			@ApiResponse(responseCode = "404", description = "Criterio no encontrado") })
	public ResponseEntity<Criterio> findOneCriterio(@PathVariable int id) {
		Optional<Criterio> criterio = criterioService.getCriterioById(id);
		if (!criterio.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		} else {
			return ResponseEntity.ok(criterio.get());
		}
	}

	@GetMapping
	@Operation(summary = "Obtener todos los criterios")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Lista de criterios obtenida exitosamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor") })
	public ResponseEntity<List<Criterio>> getAllCriterios() {
		List<Criterio> listCriterios = criterioService.getAllCriterios();
		return ResponseEntity.ok(listCriterios);
	}
}
