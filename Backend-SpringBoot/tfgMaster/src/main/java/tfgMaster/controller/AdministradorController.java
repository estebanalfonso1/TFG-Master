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
import tfgMaster.entity.Administrador;
import tfgMaster.service.AdministradorService;

@RestController
@RequestMapping("/administrador")
@Tag(name = "Administrador", description = "Operaciones relacionadas con la gestión de los administradores")
public class AdministradorController {
	@Autowired
	private AdministradorService administradorService;

	@PostMapping
	@ApiResponses(value = { @ApiResponse(responseCode = "201", description = "Administrador creado exitosamente"),
			@ApiResponse(responseCode = "400", description = "Solicitud inválida"),
			@ApiResponse(responseCode = "409", description = "El username ya está en uso") })
	public ResponseEntity<String> saveAdministrador(@RequestBody Administrador administrador) {
		if (administradorService.findByUsername(administrador.getUsername()).isPresent()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El username ya está en uso");
		} else {
			Administrador a = administradorService.saveAdministrador(administrador);
			if (a != null) {
				return ResponseEntity.status(HttpStatus.CREATED).body("Administrador creado exitosamente");
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se pudo crear el administrador");
			}
		}
	}

	@PutMapping
	@Operation(summary = "Actualizar un administrador existente")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Administrador actualizado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Administrador no encontrado"),
			@ApiResponse(responseCode = "400", description = "Solicitud inválida") })
	public ResponseEntity<String> updateAdministrador(@RequestBody Administrador updatedAdministrador) {
		Administrador response = administradorService.updateAdministrador(updatedAdministrador);
		if (response != null) {
			return ResponseEntity.status(HttpStatus.OK).body("Administrador actualizado exitosamente");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrador no encontrado");
		}
	}

	@DeleteMapping
	@Operation(summary = "Eliminar un administrador logueado")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Administrador eliminado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Administrador no encontrado") })
	public ResponseEntity<String> deleteAdministrador() {
		if (administradorService.deleteAdministrador()) {
			return ResponseEntity.status(HttpStatus.OK).body("Administrador eliminado exitosamente");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrador no encontrado");
		}
	}

}
